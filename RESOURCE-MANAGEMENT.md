# 🖥️ Liberation Platform - Resource Management

**Critical resource management for multi-service deployment on CPX21 (3 vCPU, 4GB RAM, 80GB NVMe)**

## 📊 **Resource Allocation Plan**

### **Current Server Specs**
- **CPU**: 3 vCPU cores 
- **RAM**: 4GB total
- **Storage**: 80GB NVMe SSD
- **Cost**: €9.49/month (~$10.59 USD)

### **Service Resource Allocation**

| Service | Memory Limit | CPU Limit | Storage | Priority |
|---------|--------------|-----------|---------|----------|
| **Website (prod)** | 300MB | 0.8 CPU | 2GB | High |
| **Website (staging)** | 200MB | 0.4 CPU | 1GB | Medium |
| **Liberation Analytics** | 250MB | 0.5 CPU | 5GB | High |
| **Liberation Strategist** | 400MB | 0.6 CPU | 3GB | Medium |
| **Liberation Guardian** | 100MB | 0.3 CPU | 500MB | High |
| **PostgreSQL** | 400MB | 0.5 CPU | 10GB | High |
| **Redis** | 100MB | 0.2 CPU | 1GB | Medium |
| **Prometheus** | 200MB | 0.3 CPU | 5GB | Medium |
| **Grafana** | 150MB | 0.2 CPU | 2GB | Low |
| **System** | 500MB | 0.2 CPU | 10GB | Critical |
| **Buffer** | 400MB | 0.0 CPU | 40GB | Reserve |

**Total Allocated**: 3.0GB RAM / 4.0GB (75%), 4.0 vCPU / 3.0 vCPU (133% - bursting)

## 🚨 **Critical Resource Monitoring**

### **Red Line Thresholds**
- **Memory**: 85% (3.4GB) - Start killing non-essential services
- **CPU**: 90% sustained - Scale down or migrate services  
- **Disk**: 80% (64GB) - Aggressive cleanup required
- **Swap**: Any usage - Memory pressure detected

### **Monitoring Commands**
```bash
# Quick resource check
echo "=== LIBERATION PLATFORM RESOURCES ==="
echo "💾 Memory:"
free -h | grep -E "Mem|Swap"
echo "🖥️ CPU Load:"
uptime
echo "💿 Disk:"
df -h / | tail -1
echo "🐳 Docker:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## 🧹 **Aggressive Cleanup Strategy**

### **Image Management**
- **Keep**: Current + 1 previous image per service
- **Remove**: All older images immediately
- **Frequency**: After every deployment

### **Volume Cleanup**
```bash
# Remove unused volumes (data loss risk - be careful!)
docker volume ls -qf dangling=true | xargs -r docker volume rm

# Clean build cache
docker builder prune -f

# Remove unused networks
docker network prune -f
```

### **Log Rotation**
```bash
# Limit Docker logs
echo '{"log-driver":"json-file","log-opts":{"max-size":"10m","max-file":"3"}}' > /etc/docker/daemon.json

# System log cleanup
journalctl --vacuum-time=7d
```

## ⚙️ **Service Optimization**

### **Next.js (Website)**
```javascript
// next.config.js optimizations
module.exports = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  images: {
    unoptimized: true, // Reduce memory usage
  },
  swcMinify: true,
  poweredByHeader: false,
}
```

### **PostgreSQL**
```sql
-- Reduce memory usage
ALTER SYSTEM SET shared_buffers = '128MB';
ALTER SYSTEM SET max_connections = '50';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
SELECT pg_reload_conf();
```

### **DuckDB (Analytics)**
```go
// Limit DuckDB memory usage
db.Exec("SET memory_limit='200MB'")
db.Exec("SET threads=1")
```

## 🔄 **Auto-Scaling Triggers**

### **Scale Down Triggers**
- Memory > 85%: Reduce staging resources
- Memory > 90%: Stop non-essential services (Grafana, staging)
- Memory > 95%: Emergency: Restart services to clear memory leaks

### **Scale Up Triggers**
- Consistent 90%+ resource usage for 1 week
- Services being killed by OOM
- Deployment failures due to resource constraints

### **Upgrade Path**
```
Current: CPX21 (3 vCPU, 4GB, €9.49/month)
Next: CPX31 (4 vCPU, 8GB, €16.90/month) - +€7.41
Future: CPX41 (8 vCPU, 16GB, €29.90/month) - +€20.41
```

## 🚀 **Deployment Resource Checks**

### **Pre-Deployment**
```bash
# Check available resources before deployment
AVAILABLE_MEM=$(free | grep Mem | awk '{print ($7/$2) * 100.0}')
if (( $(echo "$AVAILABLE_MEM < 20" | bc -l) )); then
  echo "⚠️ Low memory: ${AVAILABLE_MEM}% available"
  echo "🧹 Running cleanup..."
  docker system prune -f
fi
```

### **Post-Deployment**
```bash
# Verify resource usage after deployment
echo "📊 Post-deployment resource check:"
docker stats --no-stream | awk 'NR>1 {mem+=$4; cpu+=$3} END {print "Total Memory: "mem"GB, Total CPU: "cpu"%"}'
```

## 🎯 **Service Priority Matrix**

### **Critical (Never Kill)**
- Production website
- PostgreSQL 
- Liberation Guardian (monitoring)

### **Important (Kill Only in Emergency)**
- Liberation Analytics
- Redis

### **Optional (Kill When Needed)**
- Staging website
- Liberation Strategist  
- Prometheus
- Grafana

## 📈 **Growth Strategy**

### **Phase 1: Current (4GB RAM)**
- ✅ Website + Analytics + Basic monitoring
- ⚠️ Limited strategist capabilities

### **Phase 2: Upgrade to 8GB (€+7/month)**
- ✅ Full service stack
- ✅ Comfortable resource margins
- ✅ Room for traffic growth

### **Phase 3: Multi-server (Future)**
- Analytics service: Dedicated server
- Main platform: Dedicated server  
- Database: Managed service

## 🚨 **Emergency Procedures**

### **Out of Memory**
```bash
# Emergency memory recovery
docker stop liberation-platform-staging
docker stop grafana
docker system prune -f
systemctl restart docker
```

### **Out of Disk Space**
```bash
# Emergency disk cleanup
docker system prune -a -f
journalctl --vacuum-time=1d
rm -f /var/log/*.log.1
```

### **High CPU Load**
```bash
# Identify resource hogs
docker stats --no-stream | sort -k3 -nr
# Kill high-usage non-critical containers
```

---

**Remember: We're running enterprise-grade services on a $10/month server. Resource discipline is essential for the liberation platform's success!**