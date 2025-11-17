# 🐳 Docker Hub Deployment Guide

Complete guide for deploying the Liberation Platform using Docker Hub images.

## 📦 Available Images

### Core Images
- **`greenfieldoverride/liberation-platform:latest`** - Main Next.js web application (Port: 3000)
  - Built from: `thegreenfieldoverride/liberation-platform` repository
- **`greenfieldoverride/liberation-guardian:latest`** - Go microservice guardian (Port: 9000)
  - Built from: `thegreenfieldoverride/guardian` repository  
- **`greenfieldoverride/liberation-analytics:latest`** - Analytics service (Port: 8080)
  - Built from: `thegreenfieldoverride/liberation-analytics` repository

### Architecture Support
- **AMD64** (Intel/AMD processors)
- **ARM64** (Apple Silicon, ARM processors)

## 🚀 Quick Start Options

### Option 1: Single Component
Deploy just the main platform:

```bash
docker run -d -p 3000:3000 --name liberation-platform \
  greenfieldoverride/liberation-platform:latest
```

Access at: http://localhost:3000

### Option 2: Platform + Guardian
Deploy platform with guardian service:

```bash
# Start guardian
docker run -d -p 9000:9000 --name liberation-guardian \
  greenfieldoverride/liberation-guardian:latest

# Start platform with guardian connection
docker run -d -p 3000:3000 --name liberation-platform \
  -e GUARDIAN_URL=http://liberation-guardian:9000 \
  --link liberation-guardian \
  greenfieldoverride/liberation-platform:latest
```

### Option 3: Complete Stack
Deploy full liberation stack with analytics:

```bash
# Download the stack configuration
curl -O https://raw.githubusercontent.com/thegreenfieldoverride/greenfield-override/main/docker-compose.stack.yml

# Deploy the complete stack
docker-compose -f docker-compose.stack.yml up -d
```

## 🔧 Environment Variables

### Liberation Platform
```bash
NODE_ENV=production                    # Production mode
ENVIRONMENT=production                 # Environment name
GUARDIAN_URL=http://guardian:9000     # Guardian service URL
ANALYTICS_URL=http://analytics:8080   # Analytics service URL
NEXT_TELEMETRY_DISABLED=1            # Disable Next.js telemetry
```

### Liberation Guardian
```bash
GIN_MODE=release      # Gin web framework mode
LOG_LEVEL=info        # Logging level
PORT=9000             # Service port
```

### Liberation Analytics
```bash
GIN_MODE=release                                          # Gin web framework mode
LOG_LEVEL=info                                           # Logging level  
DATABASE_URL=postgres://user:pass@postgres:5432/db     # PostgreSQL connection
REDIS_URL=redis://redis:6379                            # Redis connection
```

## 🔒 Security Configuration

### Production Recommendations

1. **Use secrets for sensitive data:**
```yaml
services:
  liberation-platform:
    environment:
      - DATABASE_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
```

2. **Enable health checks:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

3. **Use non-root users** (already configured in images)

4. **Network isolation:**
```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
```

## 🏗️ Docker Compose Examples

### Minimal Setup
```yaml
version: '3.8'
services:
  liberation-platform:
    image: greenfieldoverride/liberation-platform:latest
    ports:
      - "3000:3000"
    restart: unless-stopped
```

### Development Setup
```yaml
version: '3.8'
services:
  liberation-platform:
    image: greenfieldoverride/liberation-platform:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - GUARDIAN_URL=http://guardian:9000
    depends_on:
      - guardian
      
  guardian:
    image: greenfieldoverride/liberation-guardian:latest
    ports:
      - "9000:9000"
    environment:
      - LOG_LEVEL=debug
```

### Production Setup with Load Balancer
```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - liberation-platform
      
  liberation-platform:
    image: greenfieldoverride/liberation-platform:latest
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
    networks:
      - backend
      
  guardian:
    image: greenfieldoverride/liberation-guardian:latest
    deploy:
      replicas: 2
    networks:
      - backend
      
networks:
  backend:
    driver: overlay
```

## 📊 Monitoring & Logging

### Health Check Endpoints
- Platform: `http://localhost:3000/health`
- Guardian: `http://localhost:9000/health`
- Analytics: `http://localhost:8080/health`

### Log Collection
```yaml
services:
  liberation-platform:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Prometheus Monitoring
```yaml
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

## 🔄 Updates & Maintenance

### Update Images
```bash
# Pull latest images
docker pull greenfieldoverride/liberation-platform:latest
docker pull greenfieldoverride/liberation-guardian:latest

# Recreate containers with new images
docker-compose up -d --force-recreate
```

### Backup Data
```bash
# Backup PostgreSQL data
docker exec postgres pg_dump -U liberation liberation_analytics > backup.sql

# Backup volumes
docker run --rm -v liberation_postgres_data:/backup-vol -v $(pwd):/backup alpine \
  tar czf /backup/postgres-backup.tar.gz /backup-vol
```

## 🌍 Cloud Deployment

### AWS ECS
```json
{
  "family": "liberation-platform",
  "containerDefinitions": [
    {
      "name": "liberation-platform",
      "image": "greenfieldoverride/liberation-platform:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "memory": 512,
      "essential": true
    }
  ]
}
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: liberation-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: liberation-platform
  template:
    metadata:
      labels:
        app: liberation-platform
    spec:
      containers:
      - name: liberation-platform
        image: greenfieldoverride/liberation-platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
```

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts:**
```bash
# Check what's using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

2. **Container won't start:**
```bash
# Check logs
docker logs liberation-platform

# Check container health
docker inspect liberation-platform | grep Health -A 10
```

3. **Network connectivity:**
```bash
# Test container connectivity
docker exec liberation-platform curl http://guardian:9000/health
```

## 📝 GitHub Repository Secrets

To enable automated builds, add these secrets to your GitHub repository:

1. Go to your repository Settings → Secrets and variables → Actions
2. Add these repository secrets:
   - **`DOCKER_HUB_USERNAME`**: Your Docker Hub username (`greenfieldoverride`)
   - **`DOCKER_HUB_ACCESS_TOKEN`**: Docker Hub access token

### Creating Docker Hub Access Token
1. Login to Docker Hub
2. Go to Account Settings → Security
3. Click "New Access Token"
4. Name: "GitHub Actions"
5. Permissions: Read, Write, Delete
6. Copy the token and add to GitHub secrets

## 🚀 Next Steps

1. **Add secrets to GitHub repository**
2. **Push to main branch to trigger builds**
3. **Deploy using docker-compose stack**
4. **Configure monitoring and backups**
5. **Set up SSL certificates for production**

---

**🎯 One-Line Deploy Command:**
```bash
curl -sSL https://raw.githubusercontent.com/thegreenfieldoverride/greenfield-override/main/docker-compose.stack.yml | docker-compose -f - up -d
```

Happy Liberation! 🦋