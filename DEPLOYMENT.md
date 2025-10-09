# Liberation Platform Deployment Guide

Complete guide for deploying to Hetzner Cloud with CI/CD.

## 🚀 Quick Start

### 1. Set Up Hetzner VPS

```bash
# Create a Hetzner CX11 VPS (€3.79/month)
# - OS: Ubuntu 22.04
# - SSH Key: Add your public key
# - Firewall: Default (we'll configure UFW)
```

### 2. Initial Server Setup

```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Run the setup script
curl -fsSL https://raw.githubusercontent.com/yourusername/liberation-platform/main/scripts/setup-server.sh | bash -s YOUR_USERNAME

# Or manually upload and run:
scp scripts/setup-server.sh root@YOUR_SERVER_IP:/tmp/
ssh root@YOUR_SERVER_IP 'bash /tmp/setup-server.sh YOUR_USERNAME'
```

### 3. Configure GitHub Secrets

Add these secrets in your GitHub repository settings:

```
HETZNER_HOST=YOUR_SERVER_IP
HETZNER_USER=YOUR_USERNAME  
HETZNER_SSH_KEY=YOUR_PRIVATE_SSH_KEY
```

### 4. Deploy

```bash
# Push to main branch to trigger deployment
git push origin main

# Or trigger manually in GitHub Actions
```

## 📋 Detailed Setup

### Domain Configuration

1. **Point your domain to the server:**
   ```
   A Record: thegreenfieldoverride.com → YOUR_SERVER_IP
   A Record: staging.thegreenfieldoverride.com → YOUR_SERVER_IP
   ```

2. **SSL certificates are automatic** (Caddy handles this)

### Environment Variables

1. **Copy example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in production values** (most are optional for initial deployment)

### GitHub Actions Secrets

| Secret | Description | Example |
|--------|-------------|---------|
| `HETZNER_HOST` | Server IP address | `123.456.789.012` |
| `HETZNER_USER` | SSH username | `liberation` |
| `HETZNER_SSH_KEY` | Private SSH key | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### Server Requirements

**Minimum (CX11):**
- 1 vCPU
- 4GB RAM  
- 40GB SSD
- 20TB traffic

**Recommended for growth (CX21):**
- 2 vCPU
- 8GB RAM
- 80GB SSD

## 🔧 Local Development

### Build and Test Locally

```bash
# Build Docker image and test
./scripts/deploy-local.sh

# View at http://localhost:3333
```

### Docker Compose (Alternative)

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📊 Server Management

Use the management script for common tasks:

```bash
# Check status
./scripts/server-management.sh status

# View logs
./scripts/server-management.sh logs prod

# Restart service
./scripts/server-management.sh restart prod

# Update to latest
./scripts/server-management.sh update

# Create backup
./scripts/server-management.sh backup

# Monitor in real-time
./scripts/server-management.sh monitor

# Clean up old images
./scripts/server-management.sh cleanup
```

## 🔒 Security Features

### Included Security

- **Firewall:** UFW configured (SSH, HTTP, HTTPS only)
- **Fail2ban:** Brute force protection
- **SSL/TLS:** Automatic via Caddy
- **Security headers:** CSP, HSTS, XSS protection
- **Container isolation:** Non-root user in Docker
- **Regular updates:** Automatic security patches

### Additional Security (Optional)

1. **Change SSH port:**
   ```bash
   # Edit /etc/ssh/sshd_config
   Port 2222
   sudo systemctl reload ssh
   ```

2. **Enable 2FA for SSH:**
   ```bash
   sudo apt install libpam-google-authenticator
   google-authenticator
   ```

3. **Set up monitoring:**
   ```bash
   # Install monitoring tools
   sudo apt install netdata
   ```

## 🔄 CI/CD Pipeline

### Workflow Triggers

- **Push to `main`:** Deploy to staging
- **Push to `production`:** Deploy to production  
- **Pull requests:** Run tests only

### Pipeline Steps

1. **Test:** Lint, type-check, build
2. **Build:** Create Docker image
3. **Deploy:** Push to server and restart
4. **Verify:** Health check confirmation

### Deployment Environments

| Branch | Environment | URL | Port |
|--------|-------------|-----|------|
| `main` | Staging | staging.thegreenfieldoverride.com | 3001 |
| `production` | Production | thegreenfieldoverride.com | 3000 |

## 🛠 Troubleshooting

### Common Issues

1. **Deployment fails:**
   ```bash
   # Check server logs
   ssh user@server 'docker logs liberation-platform-production'
   
   # Check GitHub Actions logs
   # Go to Actions tab in GitHub
   ```

2. **SSL certificate issues:**
   ```bash
   # Restart Caddy
   sudo systemctl restart caddy
   
   # Check Caddy logs
   sudo journalctl -u caddy -f
   ```

3. **Container won't start:**
   ```bash
   # Check container logs
   docker logs liberation-platform-production
   
   # Restart manually
   docker restart liberation-platform-production
   ```

4. **Port conflicts:**
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :3000
   
   # Kill conflicting process
   sudo kill PID
   ```

### Health Checks

```bash
# Manual health check
curl http://localhost:3000/api/health

# Container health status
docker inspect --format='{{.State.Health.Status}}' liberation-platform-production
```

### Performance Monitoring

```bash
# System resources
htop

# Docker stats
docker stats

# Disk usage
df -h

# Memory usage
free -h
```

## 💰 Cost Optimization

### Server Sizing

| Users | Server | Monthly Cost |
|-------|--------|--------------|
| < 10K | CX11 | €3.79 |
| < 50K | CX21 | €5.83 |
| < 200K | CX31 | €11.66 |

### Scaling Strategy

1. **Vertical scaling:** Upgrade server size
2. **Load balancer:** Add when needed (€5.83/month)
3. **Database:** Separate when needed
4. **CDN:** Cloudflare (free tier)

## 🔄 Backup & Recovery

### Automated Backups

- **Container state:** Daily backup of running containers
- **Volumes:** When databases are added
- **Retention:** 7 days local, extend as needed

### Manual Backup

```bash
# Create backup
./scripts/server-management.sh backup

# List backups
ls -la /opt/liberation-platform/backups/
```

### Disaster Recovery

1. **Spin up new server**
2. **Run setup script**
3. **Restore from backup**
4. **Update DNS**

## 📈 Monitoring & Alerts

### Built-in Monitoring

- **Health checks:** Every 30 seconds
- **Log rotation:** Daily, 14-day retention
- **Cron monitoring:** Every 5 minutes

### External Monitoring (Optional)

1. **UptimeRobot:** Free uptime monitoring
2. **Plausible:** Privacy-friendly analytics
3. **Sentry:** Error tracking (if needed)

## 🎯 Next Steps

### Phase 1: Get Live
- ✅ Deploy to Hetzner
- ✅ Set up CI/CD
- ✅ Configure domain
- ✅ Enable SSL

### Phase 2: Add Backend
- Add PostgreSQL
- Create Go API
- User authentication
- Data sync

### Phase 3: Scale
- Load balancer
- Multiple regions
- Advanced monitoring
- Performance optimization

---

**Need help?** Open an issue or check the troubleshooting section above.