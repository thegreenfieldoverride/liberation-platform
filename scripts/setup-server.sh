#!/bin/bash

# Liberation Platform - Hetzner Server Setup Script
# Run this on a fresh Hetzner Ubuntu 22.04 VPS

set -e

echo "🚀 Setting up Liberation Platform server..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
apt install -y \
    curl \
    wget \
    git \
    ufw \
    fail2ban \
    htop \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add user to docker group (if deployment user provided)
if [ ! -z "$1" ]; then
    usermod -aG docker $1
    echo "✅ Added user $1 to docker group"
fi

# Install Caddy (reverse proxy)
echo "🔒 Installing Caddy web server..."
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy

# Configure firewall
echo "🔥 Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Configure fail2ban
echo "🛡️ Configuring fail2ban..."
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Create deployment directory
echo "📁 Creating deployment directories..."
mkdir -p /opt/liberation-platform
mkdir -p /var/log/liberation-platform
chown -R $1:$1 /opt/liberation-platform /var/log/liberation-platform 2>/dev/null || true

# Create Caddyfile
echo "⚙️ Creating Caddy configuration..."
cat > /etc/caddy/Caddyfile << 'EOF'
# Liberation Platform Caddy Configuration

# Production site
thegreenfieldoverride.com {
    reverse_proxy localhost:3000
    
    # Security headers
    header {
        X-Frame-Options DENY
        X-Content-Type-Options nosniff
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
    }
    
    # Enable compression
    encode gzip
    
    # Logs
    log {
        output file /var/log/caddy/access.log
        format json
    }
}

# Staging site (if needed)
staging.thegreenfieldoverride.com {
    reverse_proxy localhost:3001
    
    # Same security headers
    header {
        X-Frame-Options DENY
        X-Content-Type-Options nosniff
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
    }
    
    encode gzip
    
    log {
        output file /var/log/caddy/staging-access.log
        format json
    }
}

# Redirect www to non-www
www.thegreenfieldoverride.com {
    redir https://thegreenfieldoverride.com{uri} permanent
}
EOF

# Create log directory for Caddy
mkdir -p /var/log/caddy
chown caddy:caddy /var/log/caddy

# Reload Caddy
systemctl reload caddy
systemctl enable caddy

# Create systemd service for liberation platform (optional)
cat > /etc/systemd/system/liberation-platform.service << 'EOF'
[Unit]
Description=Liberation Platform
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/liberation-platform
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Set up log rotation
cat > /etc/logrotate.d/liberation-platform << 'EOF'
/var/log/liberation-platform/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 liberation liberation
}
EOF

# Create monitoring script
cat > /opt/liberation-platform/monitor.sh << 'EOF'
#!/bin/bash
# Simple monitoring script for Liberation Platform

check_service() {
    if docker ps | grep -q liberation-platform-production; then
        echo "✅ Production service is running"
    else
        echo "❌ Production service is down"
        # Restart service
        docker start liberation-platform-production || echo "Failed to start production service"
    fi
}

check_health() {
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        echo "✅ Health check passed"
    else
        echo "❌ Health check failed"
    fi
}

echo "$(date): Liberation Platform Health Check"
check_service
check_health
echo "---"
EOF

chmod +x /opt/liberation-platform/monitor.sh

# Add enhanced monitoring to crontab
(crontab -l 2>/dev/null; echo "*/2 * * * * /opt/liberation-platform/enhanced-monitoring.sh main >> /var/log/liberation-platform/monitor.log 2>&1") | crontab -

# Create backup script
cat > /opt/liberation-platform/backup.sh << 'EOF'
#!/bin/bash
# Backup script for Liberation Platform

BACKUP_DIR="/opt/liberation-platform/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup Docker volumes (if any)
echo "Creating backup for $DATE..."

# Export running containers (for restore reference)
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}" > $BACKUP_DIR/containers_$DATE.txt

# Compress old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /opt/liberation-platform/backup.sh

# Add daily backup to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/liberation-platform/backup.sh >> /var/log/liberation-platform/backup.log 2>&1") | crontab -

echo "🎉 Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Point your domain DNS to this server's IP"
echo "2. Set up GitHub Actions secrets:"
echo "   - HETZNER_HOST: $(curl -s ifconfig.me)"
echo "   - HETZNER_USER: $(whoami)"
echo "   - HETZNER_SSH_KEY: (your private SSH key)"
echo "3. Push to main branch to trigger deployment"
echo ""
echo "📊 Server Status:"
echo "Docker: $(docker --version)"
echo "Caddy: $(caddy version)"
echo "UFW: $(ufw status | head -1)"
echo ""
echo "🔗 Services will be available at:"
echo "Production: https://thegreenfieldoverride.com"
echo "Staging: https://staging.thegreenfieldoverride.com"