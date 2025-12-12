#!/usr/bin/env python3
"""
Simple Postfix Prometheus Exporter
Connects to Postfix container via Docker API and exposes metrics
"""

import time
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler

POSTFIX_CONTAINER = "liberation-postfix"

class MetricsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/metrics':
            metrics = self.get_postfix_metrics()
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(metrics.encode())
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()
    
    def get_postfix_metrics(self):
        metrics = []
        
        # Container health
        try:
            result = subprocess.run(
                ['docker', 'inspect', '--format', '{{.State.Health.Status}}', POSTFIX_CONTAINER],
                capture_output=True, text=True, timeout=5
            )
            is_healthy = 1 if result.stdout.strip() == 'healthy' else 0
            metrics.append(f'postfix_container_healthy {is_healthy}')
        except:
            metrics.append('postfix_container_healthy 0')
        
        # Mail queue size
        try:
            result = subprocess.run(
                ['docker', 'exec', POSTFIX_CONTAINER, 'postqueue', '-p'],
                capture_output=True, text=True, timeout=5
            )
            # Parse queue output
            if 'Mail queue is empty' in result.stdout:
                queue_size = 0
            else:
                # Count lines with queue IDs (contain alphanumeric followed by *)
                queue_size = result.stdout.count('*')
            metrics.append(f'postfix_queue_size {queue_size}')
        except:
            metrics.append('postfix_queue_size -1')
        
        # Service status (dovecot, opendkim, postfix)
        for service in ['dovecot', 'opendkim', 'postfix']:
            try:
                result = subprocess.run(
                    ['docker', 'exec', POSTFIX_CONTAINER, 'supervisorctl', 'status', service],
                    capture_output=True, text=True, timeout=5
                )
                is_running = 1 if 'RUNNING' in result.stdout else 0
                metrics.append(f'postfix_service_running{{service="{service}"}} {is_running}')
            except:
                metrics.append(f'postfix_service_running{{service="{service}"}} 0')
        
        # Check recent delivery failures (last 100 log lines)
        try:
            result = subprocess.run(
                ['docker', 'logs', '--tail', '100', POSTFIX_CONTAINER],
                capture_output=True, text=True, timeout=5, stderr=subprocess.STDOUT
            )
            deferred = result.stdout.count('status=deferred')
            bounced = result.stdout.count('status=bounced')
            sent = result.stdout.count('status=sent')
            
            metrics.append(f'postfix_messages_deferred_recent {deferred}')
            metrics.append(f'postfix_messages_bounced_recent {bounced}')
            metrics.append(f'postfix_messages_sent_recent {sent}')
        except:
            pass
        
        # Add timestamp
        metrics.append(f'postfix_exporter_scrape_timestamp {int(time.time())}')
        
        return '\n'.join(metrics) + '\n'
    
    def log_message(self, format, *args):
        # Suppress request logging
        pass

def run_server(port=9154):
    server = HTTPServer(('0.0.0.0', port), MetricsHandler)
    print(f'Postfix Exporter running on port {port}')
    server.serve_forever()

if __name__ == '__main__':
    run_server()
