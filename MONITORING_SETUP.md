# Liberation Guardian Monitoring Setup

## 🎯 Overview

Complete monitoring stack for Liberation Guardian dependency automation service, with Prometheus metrics collection and Grafana dashboards.

## 🏗️ Architecture

```
📊 Monitoring Stack (Local Development)
├── 🔍 Prometheus (localhost:9092) - Metrics collection
├── 📈 Grafana (localhost:3002) - Dashboard & visualization  
└── 🗄️ Redis Exporter (existing on localhost:9121) - Redis metrics
```

## 📁 Configuration Files

### Prometheus Configuration
- **File**: `monitoring/prometheus.yml`
- **Purpose**: Defines scrape targets for Guardian, Platform, Redis, and self-monitoring
- **Port**: 9092 (to avoid conflict with existing Prometheus on 9091)

### Grafana Configuration
- **Provisioning**: `monitoring/grafana/provisioning/`
  - `datasources/prometheus.yml` - Auto-configure Prometheus datasource
  - `dashboards/dashboards.yml` - Auto-load dashboard definitions
- **Dashboards**: `monitoring/grafana/dashboards/`
  - `liberation-guardian.json` - Guardian-specific monitoring dashboard
- **Port**: 3002 (to avoid conflict with existing Grafana on 3003)

## 🚀 Deployment

### Local Development
```bash
# Deploy monitoring stack
docker-compose -f docker-compose.liberation-monitoring.yml up -d

# Access services
# Grafana: http://localhost:3002 (admin/liberation123)
# Prometheus: http://localhost:9092
```

### Production Server (144.76.255.20)
For production monitoring, deploy the monitoring stack directly on the server:

```bash
# On the server
scp -r monitoring/ user@144.76.255.20:~/liberation-platform/
scp docker-compose.liberation-monitoring.yml user@144.76.255.20:~/liberation-platform/

# Deploy on server
ssh user@144.76.255.20 "cd liberation-platform && docker-compose -f docker-compose.liberation-monitoring.yml up -d"
```

## 📊 Dashboard Features

The Guardian dashboard includes:

1. **Health Status** - Guardian service availability
2. **AI Client Status** - Gemini API connection health  
3. **HTTP Metrics** - Request rates and response times
4. **Memory Usage** - Process memory consumption
5. **Dependency Analysis** - Rate of dependency analysis events
6. **Redis Connectivity** - Shared Redis connection status

## 🔧 Metrics Configuration

Currently configured to monitor:
- **Guardian Service**: Health endpoint (needs `/metrics` endpoint implementation)
- **Platform Web App**: Health endpoint  
- **Redis**: Via existing exporter on port 9121
- **Prometheus**: Self-monitoring
- **Grafana**: Internal metrics

## ⚠️ Current Limitations

1. **Guardian Metrics**: Guardian doesn't expose `/metrics` endpoint yet - currently using `/health`
2. **Remote Access**: Local monitoring can't reach production server (expected for security)
3. **Network Isolation**: Monitoring needs to be deployed on same network as Guardian

## 🛠️ Next Steps

1. **Implement Metrics Endpoint** in Guardian Go service:
   ```go
   // Add to Guardian service
   http.HandleFunc("/metrics", promhttp.Handler())
   ```

2. **Deploy on Production Server** for real monitoring:
   ```bash
   ./scripts/deploy-monitoring.sh  # Run on server
   ```

3. **Configure Alerting** for Guardian failures:
   - Add Alertmanager configuration
   - Set up notification channels (Slack, email)

4. **Add Business Metrics**:
   - Dependency analysis success/failure rates
   - Pull request automation metrics
   - AI API usage and costs

## 🔐 Access Information

### Local Development
- **Grafana**: http://localhost:3002
  - Username: `admin`
  - Password: `liberation123`
- **Prometheus**: http://localhost:9092

### Production (when deployed)
- **Grafana**: http://144.76.255.20:3002  
- **Prometheus**: http://144.76.255.20:9092

## 📝 Files Created

```
monitoring/
├── prometheus.yml                          # Prometheus configuration
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/prometheus.yml     # Auto-configure Prometheus
│   │   └── dashboards/dashboards.yml      # Auto-load dashboards
│   └── dashboards/
│       └── liberation-guardian.json       # Guardian monitoring dashboard
scripts/
└── deploy-monitoring.sh                   # Deployment script
docker-compose.liberation-monitoring.yml   # Container orchestration
```

## ✅ Status

- ✅ Prometheus configuration complete
- ✅ Grafana provisioning configured  
- ✅ Guardian dashboard created
- ✅ Local monitoring stack deployed
- ✅ Port conflicts resolved (using 9092/3002)
- ⏳ Production deployment pending
- ⏳ Guardian metrics endpoint implementation needed