#!/bin/bash

# Liberation Platform - Integrated Startup Script
# Starts the Liberation Platform with Guardian monitoring

set -e

echo "🚀 Starting Liberation Platform with Guardian Integration"
echo "========================================================="

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found. Please run from Liberation Platform root."
    exit 1
fi

# Check if Liberation Guardian exists
if [[ ! -d "liberation-guardian" ]]; then
    echo "❌ Error: Liberation Guardian not found. Please ensure it's in liberation-guardian/"
    exit 1
fi

# Function to check if process is running on port
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Start Liberation Analytics (if not running)
echo ""
echo "📊 Starting Liberation Analytics..."
if check_port 8082; then
    echo "✅ Analytics server already running on port 8082"
else
    cd liberation-analytics
    if [[ ! -f analytics-server ]]; then
        echo "🔨 Building analytics server..."
        go build -o analytics-server
    fi
    PORT=8082 ./analytics-server &
    echo "✅ Analytics server started on port 8082"
    cd ..
fi

# Wait for analytics to be ready
echo "⏳ Waiting for analytics server..."
for i in {1..10}; do
    if curl -s http://localhost:8082/api/health > /dev/null 2>&1; then
        echo "✅ Analytics server is ready"
        break
    fi
    sleep 2
done

# Start Liberation Guardian (if not running)
echo ""
echo "🛡️ Starting Liberation Guardian..."
if check_port 9000; then
    echo "✅ Guardian already running on port 9000"
else
    cd liberation-guardian
    if [[ ! -f liberation-guardian ]]; then
        echo "🔨 Building Liberation Guardian..."
        go build -o liberation-guardian ./cmd/main.go
    fi
    
    # Set up environment
    export GOOGLE_API_KEY=${GOOGLE_API_KEY:-""}
    export LIBERATION_ANALYTICS_TOKEN=${LIBERATION_ANALYTICS_TOKEN:-"analytics_109b9bad825a594847af51abd7b0fa25469239ef24c33fc220d4dcd7038101f3"}
    export PORT=9000
    
    ./liberation-guardian &
    echo "✅ Liberation Guardian started on port 9000"
    cd ..
fi

# Wait for Guardian to be ready
echo "⏳ Waiting for Liberation Guardian..."
for i in {1..10}; do
    if curl -s http://localhost:9000/health > /dev/null 2>&1; then
        echo "✅ Liberation Guardian is ready"
        break
    fi
    sleep 2
done

# Start the main web application (if not running)
echo ""
echo "🌐 Starting Liberation Platform Web App..."
if check_port 3000; then
    echo "✅ Web app already running on port 3000"
else
    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        echo "📦 Installing dependencies..."
        pnpm install
    fi
    
    # Start in development mode
    pnpm dev &
    echo "✅ Web app starting on port 3000"
fi

# Wait for web app to be ready
echo "⏳ Waiting for web application..."
for i in {1..15}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Web application is ready"
        break
    fi
    sleep 3
done

# Send integration test to Guardian
echo ""
echo "🧪 Testing Guardian integration..."
curl -X POST http://localhost:9000/webhook/custom/liberation-platform \
     -H 'Content-Type: application/json' \
     -d '{
       "event_type": "platform_startup",
       "message": "Liberation Platform fully integrated and operational",
       "services": {
         "web": "http://localhost:3000",
         "analytics": "http://localhost:8082",
         "guardian": "http://localhost:9000"
       },
       "platform": "liberation",
       "status": "operational"
     }' > /dev/null 2>&1

echo ""
echo "🎉 Liberation Platform Integration Complete!"
echo "==========================================="
echo ""
echo "Services running:"
echo "🌐 Web App:         http://localhost:3000"
echo "📊 Analytics:       http://localhost:8082"
echo "🛡️ Guardian:        http://localhost:9000"
echo ""
echo "Guardian Features:"
echo "• AI-powered DevOps automation"
echo "• Dependency management with Trust Level 2 (Balanced)"
echo "• Real-time monitoring and incident response"
echo "• Integration with Liberation Analytics"
echo "• Cost-optimized AI (FREE Gemini models)"
echo ""
echo "Guardian Endpoints:"
echo "• Health:           http://localhost:9000/health"
echo "• Custom Webhooks:  http://localhost:9000/webhook/custom/[source]"
echo "• GitHub Webhooks:  http://localhost:9000/webhook/github"
echo ""
echo "To stop all services:"
echo "  pkill -f analytics-server"
echo "  pkill -f liberation-guardian"
echo "  pkill -f next-server"
echo ""
echo "🚀 Liberation Platform is now protected by Guardian!"