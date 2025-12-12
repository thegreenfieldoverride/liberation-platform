#!/usr/bin/env python3
"""
Postfix Prometheus Exporter - runs inside Postfix container
Exposes metrics about mail queue and service health
"""

import subprocess
import time
from http.server import HTTPServer, BaseHTTPRequestHandler

class MetricsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/metrics':
            metrics = self.get_metrics()
            self.send_response(200)
            self.send_header('Content-type', 'text/plain; version=0.0.4')
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
    
    def get_metrics(self):
        metrics = []
        
        # Mail queue size
        try:
            result = subprocess.run(['postqueue', '-p'], capture_output=True, text=True, timeout=5)
            if 'Mail queue is empty' in result.stdout:
                queue_size = 0
            else:
                queue_size = result.stdout.count('*')
            metrics.append(f'# HELP postfix_queue_size Number of messages in mail queue')
            metrics.append(f'# TYPE postfix_queue_size gauge')
            metrics.append(f'postfix_queue_size {queue_size}')
        except Exception as e:
            metrics.append(f'postfix_queue_size -1')
        
        # Service health via supervisorctl
        metrics.append(f'# HELP postfix_service_up Service is running (1) or down (0)')
        metrics.append(f'# TYPE postfix_service_up gauge')
        for service in ['dovecot', 'opendkim', 'postfix']:
            try:
                result = subprocess.run(
                    ['supervisorctl', 'status', service],
                    capture_output=True, text=True, timeout=5
                )
                is_up = 1 if 'RUNNING' in result.stdout else 0
                metrics.append(f'postfix_service_up{{service="{service}"}} {is_up}')
            except:
                metrics.append(f'postfix_service_up{{service="{service}"}} 0')
        
        # Postfix status check
        try:
            result = subprocess.run(['postfix', 'status'], capture_output=True, text=True, timeout=5)
            postfix_running = 1 if 'is running' in result.stdout else 0
            metrics.append(f'# HELP postfix_master_up Postfix master process is running')
            metrics.append(f'# TYPE postfix_master_up gauge')
            metrics.append(f'postfix_master_up {postfix_running}')
        except:
            metrics.append(f'postfix_master_up 0')
        
        # Scrape timestamp
        metrics.append(f'# HELP postfix_exporter_scrape_timestamp Unix timestamp of last scrape')
        metrics.append(f'# TYPE postfix_exporter_scrape_timestamp gauge')
        metrics.append(f'postfix_exporter_scrape_timestamp {int(time.time())}')
        
        return '\n'.join(metrics) + '\n'
    
    def log_message(self, format, *args):
        # Only log errors
        if args[1][0] != '2':
            super().log_message(format, *args)

def run_server(port=9154):
    server = HTTPServer(('0.0.0.0', port), MetricsHandler)
    print(f'Postfix metrics exporter running on port {port}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('Shutting down...')
        server.shutdown()

if __name__ == '__main__':
    run_server()
