#!/bin/bash

# Liberation Platform - Real-time Observability Dashboard
# Terminal-based dashboard for monitoring system health

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Dashboard configuration
REFRESH_INTERVAL=5
LOG_FILE="/var/log/liberation-platform/monitoring.log"
METRICS_LOG="/var/log/liberation-platform/metrics.log"

# Function to clear screen and position cursor
clear_screen() {
    clear
    tput cup 0 0
}

# Function to get service status with color
get_service_status() {
    local container=$1
    local port=$2
    
    if docker ps | grep -q "$container"; then
        if curl -f -m 3 "http://localhost:$port/api/health" >/dev/null 2>&1; then
            echo -e "${GREEN}●${NC} Healthy"
        else
            echo -e "${RED}●${NC} Unhealthy"
        fi
    else
        echo -e "${RED}●${NC} Down"
    fi
}

# Function to get memory usage with color
get_memory_usage() {
    local usage=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
    local color=$GREEN
    
    if (( $(echo "$usage > 80" | bc -l 2>/dev/null || echo "0") )); then
        color=$RED
    elif (( $(echo "$usage > 60" | bc -l 2>/dev/null || echo "0") )); then
        color=$YELLOW
    fi
    
    echo -e "${color}${usage}%${NC}"
}

# Function to get disk usage with color
get_disk_usage() {
    local usage=$(df / | awk 'NR==2 {gsub(/%/, "", $5); print $5}')
    local color=$GREEN
    
    if [ "$usage" -gt 85 ]; then
        color=$RED
    elif [ "$usage" -gt 70 ]; then
        color=$YELLOW
    fi
    
    echo -e "${color}${usage}%${NC}"
}

# Function to get load average with color
get_load_average() {
    local load=$(uptime | awk '{print $10}' | sed 's/,//')
    local color=$GREEN
    
    if (( $(echo "$load > 2.0" | bc -l 2>/dev/null || echo "0") )); then
        color=$RED
    elif (( $(echo "$load > 1.0" | bc -l 2>/dev/null || echo "0") )); then
        color=$YELLOW
    fi
    
    echo -e "${color}${load}${NC}"
}

# Function to get uptime
get_uptime() {
    uptime | awk '{
        if ($3 ~ /day/) {
            days = $3
            hours = $5
            gsub(/,/, "", hours)
            gsub(/:.*/, "", hours)
            print days " days, " hours "h"
        } else {
            hours = $3
            gsub(/:.*/, "", hours)
            gsub(/,/, "", hours)
            print hours "h"
        }
    }'
}

# Function to get container stats
get_container_stats() {
    local container=$1
    if docker ps | grep -q "$container"; then
        docker stats --no-stream --format "{{.MemPerc}} {{.CPUPerc}}" "$container" 2>/dev/null | head -1
    else
        echo "- -"
    fi
}

# Function to get recent alerts
get_recent_alerts() {
    if [ -f "/var/log/liberation-platform/alerts.log" ]; then
        tail -n 3 /var/log/liberation-platform/alerts.log | while read line; do
            echo "  $line"
        done
    else
        echo "  No recent alerts"
    fi
}

# Function to get response times
get_response_times() {
    local prod_time=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3000/api/health 2>/dev/null || echo "0")
    local staging_time=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3001/api/health 2>/dev/null || echo "0")
    
    echo "Production: ${prod_time}s"
    echo "Staging: ${staging_time}s"
}

# Function to show network stats
get_network_stats() {
    local rx_bytes=$(cat /sys/class/net/eth0/statistics/rx_bytes 2>/dev/null || echo "0")
    local tx_bytes=$(cat /sys/class/net/eth0/statistics/tx_bytes 2>/dev/null || echo "0")
    
    # Convert to MB
    local rx_mb=$((rx_bytes / 1024 / 1024))
    local tx_mb=$((tx_bytes / 1024 / 1024))
    
    echo "RX: ${rx_mb}MB | TX: ${tx_mb}MB"
}

# Function to show docker stats
show_docker_info() {
    local containers=$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | tail -n +2)
    if [ -z "$containers" ]; then
        echo "No running containers"
    else
        echo "$containers"
    fi
}

# Main dashboard function
show_dashboard() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S %Z')
    
    clear_screen
    
    echo -e "${WHITE}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${WHITE}║                    🚀 Liberation Platform Dashboard                ║${NC}"
    echo -e "${WHITE}╠══════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${WHITE}║${NC} Last Update: $timestamp"
    echo -e "${WHITE}║${NC} Server: $(hostname) | Uptime: $(get_uptime)"
    echo -e "${WHITE}╠══════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${WHITE}║ 📊 SYSTEM RESOURCES${NC}"
    echo -e "${WHITE}║${NC}"
    printf "${WHITE}║${NC} Memory:     $(get_memory_usage)$(printf '%*s' $((20 - ${#usage})) '')"
    printf "Disk:       $(get_disk_usage)\n"
    printf "${WHITE}║${NC} Load Avg:   $(get_load_average)$(printf '%*s' $((20 - ${#load})) '')"
    printf "CPU Cores:  $(nproc)\n"
    echo -e "${WHITE}║${NC} Network:    $(get_network_stats)"
    echo -e "${WHITE}║${NC}"
    echo -e "${WHITE}╠══════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${WHITE}║ 🐳 CONTAINER STATUS${NC}"
    echo -e "${WHITE}║${NC}"
    printf "${WHITE}║${NC} Production:  $(get_service_status 'liberation-platform-production' '3000')"
    printf "   $(get_container_stats 'liberation-platform-production')\n"
    printf "${WHITE}║${NC} Staging:     $(get_service_status 'liberation-platform-staging' '3001')"  
    printf "   $(get_container_stats 'liberation-platform-staging')\n"
    echo -e "${WHITE}║${NC}"
    echo -e "${WHITE}╠══════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${WHITE}║ ⚡ PERFORMANCE${NC}"
    echo -e "${WHITE}║${NC}"
    echo -e "${WHITE}║${NC} Response Times:"
    get_response_times | while read line; do
        echo -e "${WHITE}║${NC}   $line"
    done
    echo -e "${WHITE}║${NC}"
    echo -e "${WHITE}╠══════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${WHITE}║ 🚨 RECENT ALERTS${NC}"
    echo -e "${WHITE}║${NC}"
    get_recent_alerts
    echo -e "${WHITE}║${NC}"
    echo -e "${WHITE}╠══════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${WHITE}║ 🔧 DOCKER CONTAINERS${NC}"
    echo -e "${WHITE}║${NC}"
    show_docker_info | head -5 | while read line; do
        echo -e "${WHITE}║${NC} $line"
    done
    echo -e "${WHITE}║${NC}"
    echo -e "${WHITE}╠══════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${WHITE}║ 📈 QUICK STATS${NC}"
    echo -e "${WHITE}║${NC}"
    echo -e "${WHITE}║${NC} Docker Images: $(docker images | wc -l) | Volumes: $(docker volume ls | wc -l)"
    echo -e "${WHITE}║${NC} Log Size: $(du -sh /var/log/liberation-platform 2>/dev/null | cut -f1 || echo "0")"
    echo -e "${WHITE}║${NC}"
    echo -e "${WHITE}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo -e ""
    echo -e "${CYAN}[R]efresh now [Q]uit [L]ogs [M]anage [A]lerts [H]elp${NC}"
}

# Function to show logs
show_logs() {
    clear_screen
    echo -e "${WHITE}🔍 Recent Logs (Press 'q' to return to dashboard)${NC}"
    echo "=================================================="
    
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        echo "No logs found at $LOG_FILE"
        sleep 3
    fi
}

# Function to show help
show_help() {
    clear_screen
    echo -e "${WHITE}🚀 Liberation Platform Dashboard Help${NC}"
    echo "====================================="
    echo ""
    echo "Dashboard Controls:"
    echo "  R - Refresh dashboard immediately"
    echo "  Q - Quit dashboard"
    echo "  L - View real-time logs"
    echo "  M - Open management menu"
    echo "  A - Test alerts"
    echo "  H - Show this help"
    echo ""
    echo "Status Indicators:"
    echo -e "  ${GREEN}●${NC} Healthy - Service is running and responding"
    echo -e "  ${RED}●${NC} Unhealthy/Down - Service needs attention"
    echo ""
    echo "Color Coding:"
    echo -e "  ${GREEN}Green${NC} - Normal/Good"
    echo -e "  ${YELLOW}Yellow${NC} - Warning/Medium"
    echo -e "  ${RED}Red${NC} - Critical/High"
    echo ""
    echo "Press any key to return to dashboard..."
    read -n 1
}

# Function to show management menu
show_management_menu() {
    clear_screen
    echo -e "${WHITE}🔧 Liberation Platform Management${NC}"
    echo "================================="
    echo ""
    echo "1. Restart Production Service"
    echo "2. Restart Staging Service"
    echo "3. Update Services" 
    echo "4. View System Info"
    echo "5. Clean Up Docker"
    echo "6. Run Health Checks"
    echo "0. Return to Dashboard"
    echo ""
    read -p "Select option (0-6): " choice
    
    case $choice in
        1)
            echo "Restarting production service..."
            /opt/liberation-platform/scripts/server-management.sh restart prod
            ;;
        2)
            echo "Restarting staging service..."
            /opt/liberation-platform/scripts/server-management.sh restart staging
            ;;
        3)
            echo "Updating services..."
            /opt/liberation-platform/scripts/server-management.sh update
            ;;
        4)
            echo "System Information:"
            echo "==================="
            uname -a
            docker version
            free -h
            df -h
            ;;
        5)
            echo "Cleaning up Docker..."
            /opt/liberation-platform/scripts/server-management.sh cleanup
            ;;
        6)
            echo "Running health checks..."
            /opt/liberation-platform/scripts/enhanced-monitoring.sh test
            ;;
        0|*)
            return
            ;;
    esac
    
    echo ""
    echo "Press any key to continue..."
    read -n 1
}

# Function to test alerts
test_alerts() {
    clear_screen
    echo -e "${WHITE}🔔 Testing Alert System${NC}"
    echo "======================="
    
    /opt/liberation-platform/scripts/alerting-system.sh test
    
    echo ""
    echo "Press any key to return to dashboard..."
    read -n 1
}

# Interactive dashboard loop
run_interactive_dashboard() {
    # Check if required tools are available
    command -v bc >/dev/null 2>&1 || {
        echo "Installing required tools..."
        apt-get update >/dev/null 2>&1
        apt-get install -y bc >/dev/null 2>&1
    }
    
    while true; do
        show_dashboard
        
        # Wait for user input or auto-refresh
        read -t $REFRESH_INTERVAL -n 1 key
        
        case $key in
            'r'|'R')
                continue
                ;;
            'q'|'Q')
                clear_screen
                echo "Liberation Platform Dashboard closed."
                exit 0
                ;;
            'l'|'L')
                show_logs
                ;;
            'm'|'M')
                show_management_menu
                ;;
            'a'|'A')
                test_alerts
                ;;
            'h'|'H')
                show_help
                ;;
            *)
                # Auto-refresh (timeout reached)
                continue
                ;;
        esac
    done
}

# Single dashboard display (non-interactive)
show_single_dashboard() {
    show_dashboard
    echo ""
    echo "For interactive dashboard, run: $0 interactive"
}

# Command line interface
case "${1:-single}" in
    "interactive"|"live"|"watch")
        run_interactive_dashboard
        ;;
    "single"|"once"|*)
        show_single_dashboard
        ;;
esac