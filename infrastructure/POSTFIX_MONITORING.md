# Postfix Monitoring Guide

## Quick Health Checks

### Manual Commands
```bash
# Container status
ssh liberation "docker ps --filter name=postfix"

# Mail queue (should be empty)
ssh liberation "docker exec liberation-postfix mailq"

# Recent deliveries
ssh liberation "docker logs liberation-postfix 2>&1 | grep 'status=sent' | tail -10"

# Recent errors
ssh liberation "docker logs liberation-postfix 2>&1 | grep -E '(error|deferred|bounced)' | tail -20"

# Port 25 still works
ssh liberation "nc -4 -zv -w 5 smtp.google.com 25"
```

## Prometheus Metrics

Postfix now exposes Prometheus metrics at `http://liberation-postfix:9154/metrics`

### Available Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `postfix_queue_size` | gauge | Number of messages in mail queue |
| `postfix_service_up{service}` | gauge | Service status (dovecot, opendkim, postfix) |
| `postfix_master_up` | gauge | Postfix master process status |
| `postfix_exporter_scrape_timestamp` | gauge | Last scrape timestamp |

### Check Metrics
```bash
curl http://localhost:9154/metrics
```

## Prometheus Configuration

Added to `infrastructure/monitoring/prometheus/prometheus.yml`:
```yaml
- job_name: 'postfix'
  static_configs:
    - targets: ['liberation-postfix:9154']
  scrape_interval: 60s
```

## Alert Rules

Create alerts in `infrastructure/monitoring/prometheus/alerts/postfix-rules.yml`:

```yaml
groups:
  - name: postfix
    rules:
      - alert: PostfixQueueBackup
        expr: postfix_queue_size > 10
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Postfix mail queue is backing up"
          description: "{{ $value }} messages in queue"
      
      - alert: PostfixServiceDown
        expr: postfix_service_up == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Postfix service {{ $labels.service }} is down"
      
      - alert: PostfixMasterDown
        expr: postfix_master_up == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Postfix master process is down"
```

## Grafana Dashboard

Query examples for Grafana:
- **Queue Size**: `postfix_queue_size`
- **Service Status**: `postfix_service_up`
- **Uptime**: `time() - postfix_exporter_scrape_timestamp`

## Guardian Integration

Guardian can query Prometheus API to check Postfix health:
```bash
curl http://liberation-prometheus:9090/api/v1/query?query=postfix_queue_size
```

## What to Watch

### Critical
- `postfix_queue_size` > 10 for > 10 minutes (delivery issues)
- `postfix_master_up` == 0 (Postfix down)
- No metrics for > 5 minutes (exporter/container down)

### Warning
- `postfix_service_up{service="dovecot"}` == 0 (auth broken)
- `postfix_service_up{service="opendkim"}` == 0 (DKIM not signing)

### Info
- Check logs for `status=deferred` (temporary failures - normal occasionally)
- Check logs for `status=bounced` (permanent failures - investigate recipient)

## Troubleshooting

### Queue backup
```bash
# Check what's in queue
docker exec liberation-postfix postqueue -p

# View specific message
docker exec liberation-postfix postcat -q MESSAGE_ID

# Force retry
docker exec liberation-postfix postqueue -f

# Check if port 25 still works
nc -4 -zv -w 5 smtp.google.com 25
```

### DKIM failures
```bash
# Check OpenDKIM is running
docker exec liberation-postfix supervisorctl status opendkim

# Check socket permissions
docker exec liberation-postfix ls -la /var/spool/postfix/opendkim/

# Verify DKIM key exists
docker exec liberation-postfix ls -la /etc/opendkim/keys/daon.network/
```

### Authentication failures
```bash
# Check Dovecot is running
docker exec liberation-postfix supervisorctl status dovecot

# Test auth manually
docker exec liberation-postfix doveadm auth test liberation
```

## DNS Health Check

Verify your DNS records are still correct:
```bash
dig +short TXT daon.network  # SPF
dig +short TXT liberation._domainkey.daon.network  # DKIM
dig +short TXT _dmarc.daon.network  # DMARC
dig +short MX daon.network  # MX
dig +short A mail.daon.network  # A record
```
