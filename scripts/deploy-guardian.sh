#!/bin/bash
# Deploy Liberation Guardian to Hetzner server
# Usage: ./scripts/deploy-guardian.sh [branch/tag] [environment]

set -e

GUARDIAN_REF=${1:-main}
ENVIRONMENT=${2:-production}
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Server configuration - update these for your Hetzner server
HETZNER_HOST="your-server-ip"
HETZNER_USER="deploy-bot"
GUARDIAN_PORT=9000

echo "🛡️ Deploying Liberation Guardian to Hetzner (Building from Dockerfile)"
echo "📦 Guardian ref: $GUARDIAN_REF"
echo "🌍 Environment: $ENVIRONMENT"
echo "⏰ Timestamp: $TIMESTAMP"

# Deploy via SSH
ssh $HETZNER_USER@$HETZNER_HOST << EOF
set -e

echo "🛡️ Liberation Guardian deployment starting..."

# Create Guardian directory
sudo mkdir -p /opt/liberation-guardian
sudo chown deploy-bot:deploy-bot /opt/liberation-guardian
cd /opt/liberation-guardian

# Update Guardian code to specific ref
if [ -d ".git" ]; then
  echo "📥 Updating Guardian code..."
  git fetch origin
  git checkout $GUARDIAN_REF
  git pull origin $GUARDIAN_REF || true
else
  echo "📥 Cloning Guardian repository..."
  rm -rf * .* 2>/dev/null || true
  git clone https://github.com/thegreenfieldoverride/guardian.git .
  git checkout $GUARDIAN_REF
fi

# Copy environment configuration from platform repo
echo "⚙️ Setting up Guardian environment..."
cat > .env << 'ENV_EOF'
# AI Provider API Keys
GOOGLE_API_KEY=\$GOOGLE_API_KEY
ANTHROPIC_API_KEY=\$ANTHROPIC_API_KEY
OPENAI_API_KEY=\$OPENAI_API_KEY

# GitHub Integration
GITHUB_TOKEN=\$GITHUB_TOKEN
GITHUB_WEBHOOK_SECRET=\$GITHUB_WEBHOOK_SECRET

# Liberation Platform Integration
LIBERATION_ANALYTICS_URL=http://localhost:8082
LIBERATION_ANALYTICS_TOKEN=analytics_109b9bad825a594847af51abd7b0fa25469239ef24c33fc220d4dcd7038101f3

# Application Environment
ENVIRONMENT=$ENVIRONMENT
LOG_LEVEL=info
PORT=9000
TRUST_LEVEL=2

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
ENV_EOF

# Stop existing Guardian
echo "🔄 Stopping existing Guardian..."
docker stop liberation-guardian-$ENVIRONMENT 2>/dev/null || true
docker rm liberation-guardian-$ENVIRONMENT 2>/dev/null || true

# Build new Guardian image
echo "🏗️ Building Guardian image..."
docker build -t liberation-guardian:$ENVIRONMENT-$TIMESTAMP .

# Start new Guardian
echo "🚀 Starting Guardian..."
docker run -d \
  --name liberation-guardian-$ENVIRONMENT \
  --restart unless-stopped \
  -p $GUARDIAN_PORT:9000 \
  -e GOOGLE_API_KEY="\$GOOGLE_API_KEY" \
  -e GITHUB_TOKEN="\$GITHUB_TOKEN" \
  -e GITHUB_WEBHOOK_SECRET="\$GITHUB_WEBHOOK_SECRET" \
  -e ENVIRONMENT=$ENVIRONMENT \
  -e LOG_LEVEL=info \
  -e PORT=9000 \
  -e TRUST_LEVEL=2 \
  -e REDIS_HOST=localhost \
  -e REDIS_PORT=6379 \
  -e LIBERATION_ANALYTICS_URL=http://host.docker.internal:8082 \
  -e LIBERATION_ANALYTICS_TOKEN=analytics_109b9bad825a594847af51abd7b0fa25469239ef24c33fc220d4dcd7038101f3 \
  --add-host=host.docker.internal:host-gateway \
  liberation-guardian:$ENVIRONMENT-$TIMESTAMP

# Wait for Guardian to be healthy
echo "⏳ Waiting for Guardian to start..."
sleep 10

# Health check
for i in {1..10}; do
  if curl -f -s http://localhost:$GUARDIAN_PORT/health; then
    echo "✅ Guardian is healthy!"
    break
  elif [ \$i -eq 10 ]; then
    echo "❌ Guardian health check failed"
    docker logs liberation-guardian-$ENVIRONMENT --tail 20
    exit 1
  else
    echo "⏳ Health check \$i/10: waiting..."
    sleep 5
  fi
done

# Clean up old images
echo "🧹 Cleaning up old Guardian images..."
docker images liberation-guardian --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}" | \
  grep -v REPOSITORY | \
  grep "$ENVIRONMENT" | \
  sort -k2 -r | \
  tail -n +3 | \
  awk '{print \$1}' | \
  xargs -r docker rmi || true

echo "✅ Guardian deployment complete!"
echo "🌐 Guardian URL: http://$HETZNER_HOST:$GUARDIAN_PORT"
echo "📦 Image: liberation-guardian:$ENVIRONMENT-$TIMESTAMP"
EOF

echo "🎉 Guardian deployment completed successfully!"
echo "🌐 Guardian URL: http://$HETZNER_HOST:$GUARDIAN_PORT"
echo "🔍 Check status: curl http://$HETZNER_HOST:$GUARDIAN_PORT/health"