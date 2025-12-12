# Liberation Platform Infrastructure

This directory contains all infrastructure-as-code for the Liberation Platform.

## Directory Structure

```
infrastructure/
├── docker/
│   ├── compose/
│   │   ├── base.yml           # Core service definitions with profiles
│   │   ├── development.yml    # Development overrides
│   │   └── production.yml     # Production overrides
│   └── images/
│       ├── platform.Dockerfile    # Next.js web application
│       └── postfix/               # Hardened SMTP service
│           ├── Dockerfile
│           ├── config/
│           │   ├── main.cf        # Postfix main config
│           │   ├── master.cf      # Service definitions
│           │   ├── opendkim.conf  # DKIM signing config
│           │   └── ...
│           └── scripts/
│               └── entrypoint.sh  # Container initialization
├── monitoring/
│   ├── prometheus/
│   │   ├── prometheus.yml     # Scrape configuration
│   │   └── alerts/
│   │       └── rules.yml      # Alert rules
│   └── grafana/
│       ├── dashboards/        # Pre-built dashboards
│       └── provisioning/      # Auto-provisioning configs
├── mail/
│   ├── dkim/                  # DKIM keys (gitignored)
│   ├── templates/             # Email templates
│   └── config/                # Additional mail config
├── nginx/
│   └── nginx.conf             # Reverse proxy config
└── scripts/
    ├── lib/
    │   └── common.sh          # Shared bash functions
    ├── deploy/
    │   ├── local.sh           # Local deployment
    │   └── production.sh      # Production deployment
    ├── server/
    │   └── ...                # Server management scripts
    └── monitoring/
        └── ...                # Monitoring scripts
```

## Quick Start

### Local Development

```bash
# Just the platform (simplest)
./infrastructure/scripts/deploy/local.sh

# Full stack with all services
./infrastructure/scripts/deploy/local.sh --full

# Full stack with mail service
./infrastructure/scripts/deploy/local.sh --full --mail

# With monitoring
./infrastructure/scripts/deploy/local.sh --full --monitoring
```

### Using Docker Compose Directly

```bash
# Development
docker compose -f infrastructure/docker/compose/base.yml \
               -f infrastructure/docker/compose/development.yml up

# Production
docker compose -f infrastructure/docker/compose/base.yml \
               -f infrastructure/docker/compose/production.yml \
               --profile full up

# With specific profiles
docker compose -f infrastructure/docker/compose/base.yml \
               --profile full \
               --profile mail \
               --profile monitoring up
```

## Docker Compose Profiles

| Profile | Services Included |
|---------|-------------------|
| (none) | liberation-platform only |
| `full` | platform + guardian + analytics + redis + postgres |
| `guardian` | guardian + redis |
| `mail` | postfix + redis |
| `monitoring` | prometheus + grafana + redis-exporter |
| `local-ai` | ollama (for offline AI) |
| `production` | nginx reverse proxy |

## Services

### Core Services

| Service | Port | Description |
|---------|------|-------------|
| liberation-platform | 3000 | Next.js web application |
| liberation-guardian | 9000 | Go microservice for AI/DevOps |
| liberation-analytics | 8080 | Analytics service |

### Data Services

| Service | Port | Description |
|---------|------|-------------|
| liberation-redis | 6379 | Event queue and caching |
| liberation-postgres | 5432 | PostgreSQL database |

### Mail Service

| Service | Port | Description |
|---------|------|-------------|
| liberation-postfix | 587, 465 | SMTP for transactional email |

### Monitoring

| Service | Port | Description |
|---------|------|-------------|
| liberation-prometheus | 9090 | Metrics collection |
| liberation-grafana | 3001 | Dashboards |
| liberation-redis-exporter | 9121 | Redis metrics |

## Mail Service (Postfix)

The Postfix service is configured for **transactional email only** (magic links, notifications).

### Security Features

- TLS 1.2+ required for all connections
- DKIM signing for all outbound mail
- SASL authentication required
- No open relay - internal network only
- Rate limiting to prevent abuse
- Header scrubbing for privacy

### DNS Requirements

For `daon.network`, add these DNS records:

1. **SPF Record** (TXT)
   ```
   v=spf1 ip4:YOUR_SERVER_IP -all
   ```

2. **DKIM Record** (TXT) - Generated on first run
   ```
   liberation._domainkey.daon.network
   ```

3. **DMARC Record** (TXT)
   ```
   _dmarc.daon.network: v=DMARC1; p=reject; rua=mailto:dmarc@daon.network
   ```

### Environment Variables

```bash
MAIL_DOMAIN=daon.network
MAIL_HOSTNAME=mail.daon.network
DKIM_SELECTOR=liberation
SMTP_AUTH_USER=liberation
SMTP_AUTH_PASSWORD=<secure-password>
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=500
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Core
NODE_ENV=production
ENVIRONMENT=production

# Ports (change to avoid conflicts)
PLATFORM_PORT=3000
GUARDIAN_PORT=9000
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001

# Database
POSTGRES_DB=liberation_analytics
POSTGRES_USER=liberation
POSTGRES_PASSWORD=<secure-password>

# Mail
SMTP_AUTH_PASSWORD=<secure-password>
MAIL_DOMAIN=daon.network

# Monitoring
GRAFANA_ADMIN_PASSWORD=<secure-password>

# AI (optional)
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=<key>
```

## Monitoring

### Prometheus Targets

- liberation-platform:3000/health
- liberation-guardian:9000/metrics
- liberation-analytics:8080/metrics
- liberation-redis-exporter:9121/metrics

### Alerts

Pre-configured alerts for:
- Service availability
- High latency
- Resource utilization
- Redis health
- Mail queue backup

### Grafana

Access at http://localhost:3001 (default: admin/liberation123)

Pre-built dashboards:
- Liberation Guardian metrics
- Service health overview

## Migration from Old Structure

The old docker-compose files at the root still work via symlinks:

| Old Path | New Path |
|----------|----------|
| `docker-compose.yml` | Works (for local dev) |
| `Dockerfile` | `infrastructure/docker/images/platform.Dockerfile` |
| `monitoring/` | `infrastructure/monitoring/` |
| `scripts/` | `infrastructure/scripts/` |

## Troubleshooting

### Container won't start
```bash
docker compose -f infrastructure/docker/compose/base.yml logs <service>
```

### Health check failing
```bash
docker exec liberation-platform node healthcheck.js
curl http://localhost:3000/health
```

### Mail not sending
```bash
# Check Postfix logs
docker logs liberation-postfix

# Test SMTP connection
docker exec liberation-postfix postfix status

# Check mail queue
docker exec liberation-postfix mailq
```

### DKIM key not found
```bash
# Regenerate DKIM key
docker exec liberation-postfix opendkim-genkey -D /etc/opendkim/keys/daon.network -d daon.network -s liberation

# View the DNS record to add
docker exec liberation-postfix cat /etc/opendkim/keys/daon.network/liberation.txt
```
