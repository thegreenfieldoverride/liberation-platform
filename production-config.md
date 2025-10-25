# Production Configuration (PRIVATE - NOT COMMITTED)

## Server Details
- **Provider:** Hetzner Cloud
- **Server:** CX11 VPS (€3.79/month)
- **IP:** 5.161.47.48
- **Hostname:** liberation-server (in /etc/hosts)
- **OS:** Ubuntu 22.04

## GitHub Secrets Configuration
```
PRODUCTION_HOST=5.161.47.48
PRODUCTION_USER=deploy-bot
PRODUCTION_SSH_KEY=<your_private_ssh_key>
```

## SSH Access
```bash
ssh deploy-bot@liberation-server
# or
ssh deploy-bot@5.161.47.48
```

## Deployment Commands
```bash
# Deploy via GitHub Actions (automatic on push to main)
git push origin main

# Manual server access
ssh deploy-bot@liberation-server
cd /opt/liberation-platform
docker ps
docker logs liberation-platform-production
```

## Domain Configuration
- **Production:** greenfieldoverride.com → liberation-server:3000
- **Staging:** staging.greenfieldoverride.com → liberation-server:3001

## Analytics Deployment (Future)
- **Subdomain:** analytics.greenfieldoverride.com → liberation-server:8080
- **Service:** Liberation Analytics (Go + DuckDB)

---
**Note:** This file contains production secrets and should never be committed to git.