#!/bin/bash

# Liberation Guardian Monitoring Deployment Script
# This script deploys Prometheus and Grafana specifically for Guardian monitoring
# on separate ports to avoid conflicts with existing monitoring

set -e

echo "🔍 Liberation Guardian Monitoring Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if monitoring configuration exists
if [ ! -f "monitoring/prometheus.yml" ]; then
    echo -e "${RED}❌ Prometheus configuration not found at monitoring/prometheus.yml${NC}"
    exit 1
fi

if [ ! -d "monitoring/grafana" ]; then
    echo -e "${RED}❌ Grafana configuration not found at monitoring/grafana${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Checking existing monitoring services...${NC}"

# Check for conflicting services on our planned ports
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001

echo "Checking port availability..."
if lsof -i:$PROMETHEUS_PORT >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port $PROMETHEUS_PORT is in use. Using alternate port 9092${NC}"
    PROMETHEUS_PORT=9092
fi

if lsof -i:$GRAFANA_PORT >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port $GRAFANA_PORT is in use. Using alternate port 3002${NC}"
    GRAFANA_PORT=3002
fi

# Update docker-compose.monitoring.yml with correct ports
echo -e "${YELLOW}📝 Updating monitoring configuration for ports $PROMETHEUS_PORT and $GRAFANA_PORT...${NC}"

# Create a temporary docker-compose file with the correct ports
cat > docker-compose.monitoring.tmp.yml << EOF
version: '3.8'

services:
  liberation-prometheus:
    image: prom/prometheus:latest
    container_name: liberation-prometheus
    restart: unless-stopped
    networks:
      - liberation-platform-network
    ports:
      - "$PROMETHEUS_PORT:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - liberation_prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'

  liberation-grafana:
    image: grafana/grafana:latest
    container_name: liberation-grafana
    restart: unless-stopped
    networks:
      - liberation-platform-network
    ports:
      - "$GRAFANA_PORT:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=liberation123
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SERVER_DOMAIN=localhost:$GRAFANA_PORT
    volumes:
      - liberation_grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards

  # Redis metrics exporter for monitoring shared Redis
  liberation-redis-exporter:
    image: oliver006/redis_exporter:latest
    container_name: liberation-redis-exporter
    restart: unless-stopped
    networks:
      - liberation-platform-network
    ports:
      - "9121:9121"
    environment:
      - REDIS_ADDR=liberation-redis:6379
    command:
      - '--redis.addr=liberation-redis:6379'

volumes:
  liberation_prometheus_data:
  liberation_grafana_data:

networks:
  liberation-platform-network:
    external: true
EOF

echo -e "${YELLOW}🐳 Creating liberation-platform-network if it doesn't exist...${NC}"
docker network create liberation-platform-network 2>/dev/null || echo "Network already exists"

echo -e "${YELLOW}🚀 Deploying monitoring stack...${NC}"
docker-compose -f docker-compose.monitoring.tmp.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Check service health
echo -e "${YELLOW}🔍 Checking service health...${NC}"

# Check Prometheus
if curl -s "http://localhost:$PROMETHEUS_PORT/-/healthy" >/dev/null; then
    echo -e "${GREEN}✅ Prometheus is healthy at http://localhost:$PROMETHEUS_PORT${NC}"
else
    echo -e "${RED}❌ Prometheus health check failed${NC}"
fi

# Check Grafana
if curl -s "http://localhost:$GRAFANA_PORT/api/health" >/dev/null; then
    echo -e "${GREEN}✅ Grafana is healthy at http://localhost:$GRAFANA_PORT${NC}"
    echo -e "${GREEN}   📊 Login: admin / liberation123${NC}"
else
    echo -e "${RED}❌ Grafana health check failed${NC}"
fi

# Check Redis Exporter
if curl -s "http://localhost:9121/metrics" >/dev/null; then
    echo -e "${GREEN}✅ Redis Exporter is healthy at http://localhost:9121${NC}"
else
    echo -e "${RED}❌ Redis Exporter health check failed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Liberation Guardian Monitoring Deployed Successfully!${NC}"
echo "=============================================="
echo "📊 Grafana Dashboard: http://localhost:$GRAFANA_PORT"
echo "📈 Prometheus: http://localhost:$PROMETHEUS_PORT"
echo "🔍 Redis Metrics: http://localhost:9121/metrics"
echo ""
echo "Login to Grafana with: admin / liberation123"
echo ""
echo "Available dashboards:"
echo "- Liberation Guardian Monitoring (automatically loaded)"
echo ""

# Clean up temp file
rm docker-compose.monitoring.tmp.yml

echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Check Guardian metrics: http://localhost:9000/metrics"
echo "2. View Guardian dashboard in Grafana"
echo "3. Configure alerting rules if needed"