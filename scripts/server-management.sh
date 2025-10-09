#!/bin/bash

# Liberation Platform - Server Management Script
# Collection of useful server management commands

CONTAINER_PROD="liberation-platform-production"
CONTAINER_STAGING="liberation-platform-staging"

show_help() {
    echo "Liberation Platform Server Management"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  status              Show status of all services"
    echo "  logs [prod|staging] Show logs for production or staging"
    echo "  restart [prod|staging] Restart production or staging"
    echo "  update              Pull latest images and restart"
    echo "  backup              Create backup"
    echo "  monitor             Show real-time monitoring"
    echo "  cleanup             Clean up old Docker images and containers"
    echo "  ssl                 Renew SSL certificates"
    echo "  help                Show this help message"
    echo ""
}

show_status() {
    echo "🔍 Liberation Platform Status"
    echo "=========================="
    echo ""
    
    echo "📊 System Resources:"
    echo "Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
    echo "Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
    echo "Load: $(uptime | awk '{print $10 $11 $12}')"
    echo ""
    
    echo "🐳 Docker Containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    
    echo "🌐 Service Health:"
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        echo "✅ Production: Healthy"
    else
        echo "❌ Production: Unhealthy"
    fi
    
    if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
        echo "✅ Staging: Healthy"
    else
        echo "❌ Staging: Unhealthy or not running"
    fi
    echo ""
    
    echo "🔒 Caddy Status:"
    systemctl is-active caddy
    echo ""
}

show_logs() {
    local env=${1:-prod}
    local container
    
    if [ "$env" = "prod" ] || [ "$env" = "production" ]; then
        container=$CONTAINER_PROD
    elif [ "$env" = "staging" ] || [ "$env" = "stage" ]; then
        container=$CONTAINER_STAGING
    else
        echo "❌ Invalid environment. Use 'prod' or 'staging'"
        exit 1
    fi
    
    echo "📋 Showing logs for $container..."
    docker logs -f --tail=100 $container
}

restart_service() {
    local env=${1:-prod}
    local container
    
    if [ "$env" = "prod" ] || [ "$env" = "production" ]; then
        container=$CONTAINER_PROD
    elif [ "$env" = "staging" ] || [ "$env" = "stage" ]; then
        container=$CONTAINER_STAGING
    else
        echo "❌ Invalid environment. Use 'prod' or 'staging'"
        exit 1
    fi
    
    echo "🔄 Restarting $container..."
    docker restart $container
    
    # Wait for health check
    sleep 10
    
    if [ "$env" = "prod" ] || [ "$env" = "production" ]; then
        port=3000
    else
        port=3001
    fi
    
    if curl -f http://localhost:$port/api/health >/dev/null 2>&1; then
        echo "✅ $container restarted successfully"
    else
        echo "❌ $container restart failed or health check failed"
    fi
}

update_services() {
    echo "🔄 Updating Liberation Platform..."
    
    # Pull latest images
    echo "📥 Pulling latest images..."
    docker pull ghcr.io/thegreenfieldoverride/liberation-platform:main
    
    # Restart production
    echo "🚀 Restarting production..."
    docker stop $CONTAINER_PROD || true
    docker rm $CONTAINER_PROD || true
    
    docker run -d \
        --name $CONTAINER_PROD \
        --restart unless-stopped \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e ENVIRONMENT=production \
        --health-cmd="node healthcheck.js" \
        --health-interval=30s \
        --health-timeout=3s \
        --health-retries=3 \
        ghcr.io/thegreenfieldoverride/liberation-platform:main
    
    echo "✅ Update complete"
}

create_backup() {
    echo "💾 Creating backup..."
    
    BACKUP_DIR="/opt/liberation-platform/backups"
    DATE=$(date +%Y%m%d_%H%M%S)
    
    mkdir -p $BACKUP_DIR
    
    # Backup container state
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}" > $BACKUP_DIR/containers_$DATE.txt
    
    # Backup any volumes (if they exist)
    if docker volume ls | grep -q liberation; then
        docker run --rm -v liberation_data:/data -v $BACKUP_DIR:/backup ubuntu tar czf /backup/volumes_$DATE.tar.gz -C /data .
    fi
    
    echo "✅ Backup created: $BACKUP_DIR/backup_$DATE"
}

show_monitor() {
    echo "📊 Real-time Liberation Platform Monitoring"
    echo "Press Ctrl+C to exit"
    echo ""
    
    while true; do
        clear
        show_status
        echo "Last updated: $(date)"
        sleep 10
    done
}

cleanup_docker() {
    echo "🧹 Cleaning up Docker resources..."
    
    # Remove stopped containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    echo "✅ Cleanup complete"
    
    # Show disk space saved
    echo "💾 Current disk usage:"
    df -h /
}

renew_ssl() {
    echo "🔒 Renewing SSL certificates..."
    
    # Caddy automatically renews certificates, but we can force a reload
    systemctl reload caddy
    
    echo "✅ SSL certificate renewal triggered"
}

# Main script logic
case "$1" in
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "restart")
        restart_service "$2"
        ;;
    "update")
        update_services
        ;;
    "backup")
        create_backup
        ;;
    "monitor")
        show_monitor
        ;;
    "cleanup")
        cleanup_docker
        ;;
    "ssl")
        renew_ssl
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 help' for available commands"
        exit 1
        ;;
esac