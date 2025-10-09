#!/bin/bash

# Liberation Platform - Enhanced Monitoring & Auto-Recovery
# Advanced observability with intelligent auto-restart and alerting

set -e

CONTAINER_PROD="liberation-platform-production"
CONTAINER_STAGING="liberation-platform-staging"
LOG_FILE="/var/log/liberation-platform/monitoring.log"
ALERT_LOG="/var/log/liberation-platform/alerts.log"
METRICS_LOG="/var/log/liberation-platform/metrics.log"

# Ensure log directory exists
mkdir -p /var/log/liberation-platform

# Configuration
HEALTH_ENDPOINT_PROD="http://localhost:3000/api/health"
HEALTH_ENDPOINT_STAGING="http://localhost:3001/api/health"
MAX_RESTART_ATTEMPTS=3
RESTART_COOLDOWN=300  # 5 minutes between restart attempts
MEMORY_THRESHOLD=80   # Alert if memory usage > 80%
DISK_THRESHOLD=85     # Alert if disk usage > 85%
LOAD_THRESHOLD=2.0    # Alert if load average > 2.0

# State tracking
RESTART_COUNT_FILE="/tmp/liberation-restart-count"
LAST_RESTART_FILE="/tmp/liberation-last-restart"

log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

log_alert() {
    local message=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] ALERT: $message" | tee -a "$ALERT_LOG"
    log_message "ALERT" "$message"
}

log_metrics() {
    local metrics=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $metrics" >> "$METRICS_LOG"
}

# System metrics collection
collect_system_metrics() {
    # Memory usage
    local memory_percent=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
    
    # Disk usage
    local disk_percent=$(df / | awk 'NR==2 {gsub(/%/, "", $5); print $5}')
    
    # Load average
    local load_avg=$(uptime | awk '{print $10}' | sed 's/,//')
    
    # CPU usage (5 second average)
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    
    # Docker stats
    local container_memory=""
    local container_cpu=""
    
    if docker ps | grep -q "$CONTAINER_PROD"; then
        local stats=$(docker stats --no-stream --format "table {{.MemPerc}}\t{{.CPUPerc}}" "$CONTAINER_PROD" 2>/dev/null | tail -n1)
        container_memory=$(echo "$stats" | awk '{print $1}' | sed 's/%//')
        container_cpu=$(echo "$stats" | awk '{print $2}' | sed 's/%//')
    fi
    
    # Log metrics
    log_metrics "SYSTEM memory_percent=$memory_percent disk_percent=$disk_percent load_avg=$load_avg cpu_usage=$cpu_usage"
    log_metrics "CONTAINER memory_percent=$container_memory cpu_percent=$container_cpu"
    
    # Check thresholds
    if (( $(echo "$memory_percent > $MEMORY_THRESHOLD" | bc -l) )); then
        log_alert "High memory usage: ${memory_percent}% (threshold: ${MEMORY_THRESHOLD}%)"
    fi
    
    if (( disk_percent > DISK_THRESHOLD )); then
        log_alert "High disk usage: ${disk_percent}% (threshold: ${DISK_THRESHOLD}%)"
    fi
    
    if (( $(echo "$load_avg > $LOAD_THRESHOLD" | bc -l) )); then
        log_alert "High load average: $load_avg (threshold: $LOAD_THRESHOLD)"
    fi
}

# Enhanced health check with detailed diagnostics
enhanced_health_check() {
    local endpoint=$1
    local container=$2
    local env_name=$3
    
    log_message "INFO" "Performing enhanced health check for $env_name"
    
    # Basic connectivity
    if ! curl -f -m 5 "$endpoint" >/dev/null 2>&1; then
        log_message "ERROR" "$env_name health endpoint unreachable"
        return 1
    fi
    
    # Response time check
    local response_time=$(curl -o /dev/null -s -w '%{time_total}' "$endpoint")
    if (( $(echo "$response_time > 5.0" | bc -l) )); then
        log_alert "$env_name slow response time: ${response_time}s"
    fi
    
    # Container status check
    if ! docker ps | grep -q "$container"; then
        log_message "ERROR" "$env_name container not running"
        return 1
    fi
    
    # Container health status
    local health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null)
    if [ "$health_status" != "healthy" ]; then
        log_message "ERROR" "$env_name container health status: $health_status"
        return 1
    fi
    
    log_message "INFO" "$env_name health check passed (response_time: ${response_time}s)"
    return 0
}

# Smart restart with cooldown and attempt limiting
smart_restart() {
    local container=$1
    local env_name=$2
    local image_name=$3
    local port_mapping=$4
    
    log_message "INFO" "Initiating smart restart for $env_name"
    
    # Check restart cooldown
    if [ -f "$LAST_RESTART_FILE" ]; then
        local last_restart=$(cat "$LAST_RESTART_FILE")
        local current_time=$(date +%s)
        local time_diff=$((current_time - last_restart))
        
        if [ $time_diff -lt $RESTART_COOLDOWN ]; then
            log_message "WARN" "Restart cooldown active, skipping restart ($time_diff/$RESTART_COOLDOWN seconds)"
            return 1
        fi
    fi
    
    # Check restart attempt count
    local restart_count=0
    if [ -f "$RESTART_COUNT_FILE" ]; then
        restart_count=$(cat "$RESTART_COUNT_FILE")
    fi
    
    if [ $restart_count -ge $MAX_RESTART_ATTEMPTS ]; then
        log_alert "Maximum restart attempts reached ($restart_count/$MAX_RESTART_ATTEMPTS) - manual intervention required"
        return 1
    fi
    
    # Increment restart count and update timestamp
    echo $((restart_count + 1)) > "$RESTART_COUNT_FILE"
    echo $(date +%s) > "$LAST_RESTART_FILE"
    
    log_message "INFO" "Attempting restart $((restart_count + 1))/$MAX_RESTART_ATTEMPTS for $env_name"
    
    # Collect diagnostics before restart
    log_message "INFO" "Collecting pre-restart diagnostics"
    docker logs --tail=50 "$container" >> "$LOG_FILE" 2>&1 || true
    
    # Stop and remove container
    docker stop "$container" >/dev/null 2>&1 || true
    docker rm "$container" >/dev/null 2>&1 || true
    
    # Start new container
    log_message "INFO" "Starting new container for $env_name"
    
    if [ "$env_name" = "production" ]; then
        local env_vars="-e NODE_ENV=production -e ENVIRONMENT=production"
    else
        local env_vars="-e NODE_ENV=production -e ENVIRONMENT=staging"
    fi
    
    docker run -d \
        --name "$container" \
        --restart unless-stopped \
        -p "$port_mapping" \
        $env_vars \
        --health-cmd="node healthcheck.js" \
        --health-interval=30s \
        --health-timeout=3s \
        --health-retries=3 \
        "$image_name" >/dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        log_message "INFO" "Container restarted successfully for $env_name"
        
        # Wait for health check
        local attempts=0
        local max_attempts=12  # 2 minutes
        
        while [ $attempts -lt $max_attempts ]; do
            sleep 10
            if enhanced_health_check "http://localhost:${port_mapping%:*}/api/health" "$container" "$env_name"; then
                log_message "INFO" "Health check passed after restart for $env_name"
                # Reset restart count on successful recovery
                echo 0 > "$RESTART_COUNT_FILE"
                return 0
            fi
            attempts=$((attempts + 1))
        done
        
        log_alert "Health check failed after restart for $env_name"
        return 1
    else
        log_alert "Failed to restart container for $env_name"
        return 1
    fi
}

# Service monitoring with auto-recovery
monitor_service() {
    local container=$1
    local endpoint=$2
    local env_name=$3
    local image_name=$4
    local port_mapping=$5
    
    if enhanced_health_check "$endpoint" "$container" "$env_name"; then
        log_message "INFO" "$env_name service healthy"
        return 0
    else
        log_message "WARN" "$env_name service unhealthy, attempting recovery"
        
        # Try simple restart first
        if docker restart "$container" >/dev/null 2>&1; then
            sleep 30
            if enhanced_health_check "$endpoint" "$container" "$env_name"; then
                log_message "INFO" "$env_name recovered with simple restart"
                return 0
            fi
        fi
        
        # If simple restart failed, try smart restart
        smart_restart "$container" "$env_name" "$image_name" "$port_mapping"
    fi
}

# Network connectivity check
check_network_connectivity() {
    log_message "INFO" "Checking network connectivity"
    
    # Check internet connectivity
    if ! curl -f -m 5 https://8.8.8.8:53 >/dev/null 2>&1; then
        log_alert "Internet connectivity issue detected"
    fi
    
    # Check DNS resolution
    if ! nslookup google.com >/dev/null 2>&1; then
        log_alert "DNS resolution issue detected"
    fi
    
    # Check if Docker daemon is running
    if ! docker ps >/dev/null 2>&1; then
        log_alert "Docker daemon not responding"
        systemctl restart docker || log_alert "Failed to restart Docker daemon"
    fi
}

# Disk cleanup
perform_disk_cleanup() {
    local disk_usage=$(df / | awk 'NR==2 {gsub(/%/, "", $5); print $5}')
    
    if [ $disk_usage -gt 90 ]; then
        log_message "INFO" "Performing emergency disk cleanup (usage: ${disk_usage}%)"
        
        # Clean Docker
        docker system prune -f >/dev/null 2>&1
        
        # Clean logs older than 7 days
        find /var/log -name "*.log" -mtime +7 -delete 2>/dev/null || true
        
        # Clean temp files
        find /tmp -mtime +1 -delete 2>/dev/null || true
        
        local new_usage=$(df / | awk 'NR==2 {gsub(/%/, "", $5); print $5}')
        log_message "INFO" "Disk cleanup completed (usage: ${disk_usage}% -> ${new_usage}%)"
    fi
}

# Log rotation
rotate_logs() {
    # Rotate monitoring logs if they're too large (>10MB)
    for log_file in "$LOG_FILE" "$ALERT_LOG" "$METRICS_LOG"; do
        if [ -f "$log_file" ] && [ $(stat -f%z "$log_file" 2>/dev/null || stat -c%s "$log_file") -gt 10485760 ]; then
            mv "$log_file" "${log_file}.$(date +%Y%m%d_%H%M%S)"
            touch "$log_file"
            log_message "INFO" "Rotated log file: $log_file"
        fi
    done
}

# Main monitoring function
main() {
    log_message "INFO" "Starting enhanced monitoring cycle"
    
    # Collect system metrics
    collect_system_metrics
    
    # Check network connectivity
    check_network_connectivity
    
    # Monitor production service
    monitor_service \
        "$CONTAINER_PROD" \
        "$HEALTH_ENDPOINT_PROD" \
        "production" \
        "ghcr.io/thegreenfieldoverride/liberation-platform:main" \
        "3000:3000"
    
    # Monitor staging service (if running)
    if docker ps | grep -q "$CONTAINER_STAGING"; then
        monitor_service \
            "$CONTAINER_STAGING" \
            "$HEALTH_ENDPOINT_STAGING" \
            "staging" \
            "ghcr.io/thegreenfieldoverride/liberation-platform:main" \
            "3001:3000"
    fi
    
    # Perform maintenance tasks
    perform_disk_cleanup
    rotate_logs
    
    log_message "INFO" "Monitoring cycle completed"
}

# Install required packages if missing
install_dependencies() {
    if ! command -v bc >/dev/null 2>&1; then
        log_message "INFO" "Installing bc for calculations"
        apt-get update >/dev/null 2>&1
        apt-get install -y bc >/dev/null 2>&1
    fi
}

# Command line interface
case "${1:-main}" in
    "install")
        install_dependencies
        log_message "INFO" "Enhanced monitoring dependencies installed"
        ;;
    "test")
        log_message "INFO" "Running monitoring test"
        collect_system_metrics
        enhanced_health_check "$HEALTH_ENDPOINT_PROD" "$CONTAINER_PROD" "production"
        ;;
    "restart-prod")
        smart_restart "$CONTAINER_PROD" "production" "ghcr.io/thegreenfieldoverride/liberation-platform:main" "3000:3000"
        ;;
    "restart-staging")
        smart_restart "$CONTAINER_STAGING" "staging" "ghcr.io/thegreenfieldoverride/liberation-platform:main" "3001:3000"
        ;;
    "metrics")
        collect_system_metrics
        ;;
    "cleanup")
        perform_disk_cleanup
        ;;
    "main")
        main
        ;;
    *)
        echo "Usage: $0 [install|test|restart-prod|restart-staging|metrics|cleanup|main]"
        exit 1
        ;;
esac