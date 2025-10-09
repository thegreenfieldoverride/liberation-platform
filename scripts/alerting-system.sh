#!/bin/bash

# Liberation Platform - Alerting System
# Send alerts via multiple channels when issues are detected

ALERT_LOG="/var/log/liberation-platform/alerts.log"
ALERT_STATE_DIR="/tmp/liberation-alerts"
COOLDOWN_PERIOD=3600  # 1 hour between duplicate alerts

mkdir -p "$ALERT_STATE_DIR"

# Configuration - add your details here
DISCORD_WEBHOOK_URL=""  # Add your Discord webhook URL
SLACK_WEBHOOK_URL=""    # Add your Slack webhook URL  
EMAIL_RECIPIENT=""      # Add your email address
NTFY_TOPIC=""          # Add your ntfy.sh topic

log_alert() {
    local alert_type=$1
    local message=$2
    local severity=${3:-"warning"}  # info, warning, critical
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] [$severity] $alert_type: $message" >> "$ALERT_LOG"
    
    # Check if we've already sent this alert recently (avoid spam)
    local alert_hash=$(echo "$alert_type:$message" | md5sum | cut -d' ' -f1)
    local last_sent_file="$ALERT_STATE_DIR/$alert_hash"
    
    if [ -f "$last_sent_file" ]; then
        local last_sent=$(cat "$last_sent_file")
        local current_time=$(date +%s)
        local time_diff=$((current_time - last_sent))
        
        if [ $time_diff -lt $COOLDOWN_PERIOD ]; then
            echo "Alert suppressed (cooldown): $message"
            return 0
        fi
    fi
    
    # Record this alert
    echo $(date +%s) > "$last_sent_file"
    
    # Send alerts
    send_discord_alert "$alert_type" "$message" "$severity"
    send_slack_alert "$alert_type" "$message" "$severity" 
    send_ntfy_alert "$alert_type" "$message" "$severity"
    send_email_alert "$alert_type" "$message" "$severity"
}

send_discord_alert() {
    local alert_type=$1
    local message=$2
    local severity=$3
    
    if [ -z "$DISCORD_WEBHOOK_URL" ]; then
        return 0
    fi
    
    local color
    case $severity in
        "critical") color="15158332" ;;  # Red
        "warning") color="16776960" ;;   # Yellow
        "info") color="3447003" ;;       # Blue
        *) color="8421504" ;;            # Gray
    esac
    
    local emoji
    case $severity in
        "critical") emoji="🚨" ;;
        "warning") emoji="⚠️" ;;
        "info") emoji="ℹ️" ;;
        *) emoji="📊" ;;
    esac
    
    local payload=$(cat <<EOF
{
  "embeds": [{
    "title": "$emoji Liberation Platform Alert",
    "description": "**$alert_type**\n$message",
    "color": $color,
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)",
    "footer": {
      "text": "Liberation Platform Monitoring"
    },
    "fields": [
      {
        "name": "Severity",
        "value": "$severity",
        "inline": true
      },
      {
        "name": "Server",
        "value": "$(hostname)",
        "inline": true
      }
    ]
  }]
}
EOF
)
    
    curl -X POST "$DISCORD_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "$payload" >/dev/null 2>&1
}

send_slack_alert() {
    local alert_type=$1
    local message=$2
    local severity=$3
    
    if [ -z "$SLACK_WEBHOOK_URL" ]; then
        return 0
    fi
    
    local color
    case $severity in
        "critical") color="danger" ;;
        "warning") color="warning" ;;
        "info") color="good" ;;
        *) color="#808080" ;;
    esac
    
    local emoji
    case $severity in
        "critical") emoji=":rotating_light:" ;;
        "warning") emoji=":warning:" ;;
        "info") emoji=":information_source:" ;;
        *) emoji=":chart_with_upwards_trend:" ;;
    esac
    
    local payload=$(cat <<EOF
{
  "attachments": [
    {
      "color": "$color",
      "title": "$emoji Liberation Platform Alert",
      "text": "*$alert_type*\n$message",
      "footer": "Liberation Platform Monitoring",
      "ts": $(date +%s),
      "fields": [
        {
          "title": "Severity",
          "value": "$severity",
          "short": true
        },
        {
          "title": "Server", 
          "value": "$(hostname)",
          "short": true
        }
      ]
    }
  ]
}
EOF
)
    
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "$payload" >/dev/null 2>&1
}

send_ntfy_alert() {
    local alert_type=$1
    local message=$2
    local severity=$3
    
    if [ -z "$NTFY_TOPIC" ]; then
        return 0
    fi
    
    local priority
    case $severity in
        "critical") priority="urgent" ;;
        "warning") priority="high" ;;
        "info") priority="default" ;;
        *) priority="low" ;;
    esac
    
    local emoji
    case $severity in
        "critical") emoji="🚨" ;;
        "warning") emoji="⚠️" ;;
        "info") emoji="ℹ️" ;;
        *) emoji="📊" ;;
    esac
    
    curl -X POST "https://ntfy.sh/$NTFY_TOPIC" \
        -H "Title: $emoji Liberation Platform Alert" \
        -H "Priority: $priority" \
        -H "Tags: liberation,monitoring,$severity" \
        -d "$alert_type: $message" >/dev/null 2>&1
}

send_email_alert() {
    local alert_type=$1
    local message=$2
    local severity=$3
    
    if [ -z "$EMAIL_RECIPIENT" ] || ! command -v mail >/dev/null 2>&1; then
        return 0
    fi
    
    local subject="[Liberation Platform] $severity: $alert_type"
    local body=$(cat <<EOF
Liberation Platform Alert

Type: $alert_type
Severity: $severity
Time: $(date '+%Y-%m-%d %H:%M:%S %Z')
Server: $(hostname)
IP: $(curl -s ifconfig.me 2>/dev/null || echo "unknown")

Message:
$message

---
This is an automated alert from your Liberation Platform monitoring system.
EOF
)
    
    echo "$body" | mail -s "$subject" "$EMAIL_RECIPIENT" >/dev/null 2>&1
}

# Test all alerting channels
test_alerts() {
    echo "Testing all alert channels..."
    
    log_alert "TEST_ALERT" "This is a test alert to verify all notification channels are working" "info"
    
    echo "Test alerts sent. Check your configured channels:"
    [ -n "$DISCORD_WEBHOOK_URL" ] && echo "  - Discord webhook configured"
    [ -n "$SLACK_WEBHOOK_URL" ] && echo "  - Slack webhook configured"
    [ -n "$NTFY_TOPIC" ] && echo "  - ntfy.sh topic configured" 
    [ -n "$EMAIL_RECIPIENT" ] && echo "  - Email recipient configured"
    
    if [ -z "$DISCORD_WEBHOOK_URL" ] && [ -z "$SLACK_WEBHOOK_URL" ] && [ -z "$NTFY_TOPIC" ] && [ -z "$EMAIL_RECIPIENT" ]; then
        echo "  - No alert channels configured. Edit this script to add webhook URLs."
    fi
}

# Setup alert channels (interactive)
setup_alerts() {
    echo "🔔 Setting up Liberation Platform Alerts"
    echo "==============================================="
    echo ""
    echo "This will help you configure notification channels for your server."
    echo "You can skip any channel by pressing Enter."
    echo ""
    
    # Discord
    echo "🎮 Discord Webhook (recommended):"
    echo "1. Go to your Discord server settings"
    echo "2. Go to Integrations > Webhooks"
    echo "3. Create a new webhook and copy the URL"
    read -p "Discord webhook URL (optional): " discord_url
    
    # Slack
    echo ""
    echo "💬 Slack Webhook:"
    echo "1. Go to https://api.slack.com/apps"
    echo "2. Create a new app and add Incoming Webhooks"
    echo "3. Copy the webhook URL"
    read -p "Slack webhook URL (optional): " slack_url
    
    # ntfy.sh
    echo ""
    echo "📱 ntfy.sh (phone notifications):"
    echo "1. Install ntfy app on your phone"
    echo "2. Choose a unique topic name (e.g., liberation-alerts-$(whoami))"
    read -p "ntfy.sh topic (optional): " ntfy_topic
    
    # Email
    echo ""
    echo "📧 Email alerts:"
    echo "Requires 'mail' command to be configured on server"
    read -p "Email address (optional): " email_addr
    
    # Update the script with user's preferences
    sed -i.bak \
        -e "s|DISCORD_WEBHOOK_URL=\"\"|DISCORD_WEBHOOK_URL=\"$discord_url\"|" \
        -e "s|SLACK_WEBHOOK_URL=\"\"|SLACK_WEBHOOK_URL=\"$slack_url\"|" \
        -e "s|NTFY_TOPIC=\"\"|NTFY_TOPIC=\"$ntfy_topic\"|" \
        -e "s|EMAIL_RECIPIENT=\"\"|EMAIL_RECIPIENT=\"$email_addr\"|" \
        "$0"
    
    echo ""
    echo "✅ Alert configuration saved!"
    echo ""
    echo "Testing alerts in 3 seconds..."
    sleep 3
    test_alerts
}

# Monitor integration - called by enhanced monitoring
monitor_alert() {
    local alert_type=$1
    local message=$2
    local severity=${3:-"warning"}
    
    log_alert "$alert_type" "$message" "$severity"
}

# Command line interface
case "${1:-help}" in
    "setup")
        setup_alerts
        ;;
    "test")
        test_alerts
        ;;
    "alert")
        monitor_alert "$2" "$3" "$4"
        ;;
    "critical")
        monitor_alert "$2" "$3" "critical"
        ;;
    "warning")
        monitor_alert "$2" "$3" "warning"
        ;;
    "info")
        monitor_alert "$2" "$3" "info"
        ;;
    "help"|*)
        echo "Liberation Platform Alerting System"
        echo ""
        echo "Usage: $0 [COMMAND] [OPTIONS]"
        echo ""
        echo "Commands:"
        echo "  setup              Interactive setup of alert channels"
        echo "  test               Test all configured alert channels"
        echo "  alert TYPE MSG     Send generic alert"
        echo "  critical TYPE MSG  Send critical alert"
        echo "  warning TYPE MSG   Send warning alert" 
        echo "  info TYPE MSG      Send info alert"
        echo ""
        echo "Examples:"
        echo "  $0 setup"
        echo "  $0 test"
        echo "  $0 critical 'SERVICE_DOWN' 'Production service is not responding'"
        echo "  $0 warning 'HIGH_MEMORY' 'Memory usage is at 85%'"
        ;;
esac