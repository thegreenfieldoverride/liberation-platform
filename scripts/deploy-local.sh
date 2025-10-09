#!/bin/bash

# Liberation Platform - Local Development Deployment
# Test Docker build and deployment locally before pushing

set -e

echo "🧪 Building Liberation Platform locally..."

# Build the Docker image
echo "🐳 Building Docker image..."
docker build -t liberation-platform:local .

# Stop existing container if running
echo "🛑 Stopping existing containers..."
docker stop liberation-platform-local 2>/dev/null || true
docker rm liberation-platform-local 2>/dev/null || true

# Run the container
echo "🚀 Starting container..."
docker run -d \
    --name liberation-platform-local \
    -p 3333:3000 \
    -e NODE_ENV=production \
    -e ENVIRONMENT=local \
    --health-cmd="node healthcheck.js" \
    --health-interval=30s \
    --health-timeout=3s \
    --health-retries=3 \
    liberation-platform:local

# Wait for container to be healthy
echo "⏳ Waiting for container to be healthy..."
timeout=60
counter=0

while [ $counter -lt $timeout ]; do
    if docker inspect --format='{{.State.Health.Status}}' liberation-platform-local 2>/dev/null | grep -q "healthy"; then
        echo "✅ Container is healthy!"
        break
    fi
    
    if [ $counter -eq 0 ]; then
        echo -n "Waiting"
    fi
    echo -n "."
    sleep 1
    counter=$((counter + 1))
done

echo ""

if [ $counter -ge $timeout ]; then
    echo "❌ Container failed to become healthy within $timeout seconds"
    echo "Container logs:"
    docker logs liberation-platform-local
    exit 1
fi

# Test the health endpoint
echo "🔍 Testing health endpoint..."
if curl -f http://localhost:3333/api/health; then
    echo ""
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed"
    docker logs liberation-platform-local
    exit 1
fi

echo ""
echo "🎉 Local deployment successful!"
echo "🌐 Open http://localhost:3333 to view the app"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker logs liberation-platform-local"
echo "  Stop: docker stop liberation-platform-local"
echo "  Shell: docker exec -it liberation-platform-local sh"