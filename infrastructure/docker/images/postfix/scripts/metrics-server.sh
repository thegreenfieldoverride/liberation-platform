#!/bin/sh
# Simple HTTP server that exposes Postfix metrics
# Runs inside the Postfix container

PORT=9154

while true; do
    # Wait for HTTP request
    echo "Waiting for metrics request on port $PORT..."
    
    # Simple netcat-based HTTP server
    {
        echo "HTTP/1.1 200 OK"
        echo "Content-Type: text/plain"
        echo ""
        
        # Container health (always 1 if this script is running)
        echo "postfix_container_healthy 1"
        
        # Mail queue size
        QUEUE_OUTPUT=$(postqueue -p 2>/dev/null)
        if echo "$QUEUE_OUTPUT" | grep -q "Mail queue is empty"; then
            echo "postfix_queue_size 0"
        else
            QUEUE_SIZE=$(echo "$QUEUE_OUTPUT" | grep -c "\*")
            echo "postfix_queue_size $QUEUE_SIZE"
        fi
        
        # Service status via supervisorctl
        for service in dovecot opendkim postfix; do
            if supervisorctl status $service 2>/dev/null | grep -q RUNNING; then
                echo "postfix_service_running{service=\"$service\"} 1"
            else
                echo "postfix_service_running{service=\"$service\"} 0"
            fi
        done
        
        # Timestamp
        echo "postfix_exporter_scrape_timestamp $(date +%s)"
        
    } | nc -l -p $PORT -q 1
    
    sleep 1
done
