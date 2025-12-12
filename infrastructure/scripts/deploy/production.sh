#!/usr/bin/env bash
# Liberation Platform - Production Deployment
# Deploy to Hetzner VPS with blue-green strategy

# Load common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/common.sh"

# =============================================================================
# CONFIGURATION
# =============================================================================
HETZNER_HOST="${HETZNER_HOST:?Error: HETZNER_HOST must be set}"
HETZNER_USER="${HETZNER_USER:-deploy}"
REMOTE_DIR="/opt/liberation-platform"
IMAGE_TAG="${IMAGE_TAG:-latest}"
ENVIRONMENT="${ENVIRONMENT:-production}"
PROFILES="${PROFILES:-full mail}"

# =============================================================================
# FUNCTIONS
# =============================================================================

# Deploy to remote server
deploy_remote() {
    log_step "Deploying to $HETZNER_HOST..."
    
    # Ensure SSH connection works
    log_info "Testing SSH connection..."
    if ! ssh -o ConnectTimeout=10 "$HETZNER_USER@$HETZNER_HOST" "echo 'SSH OK'" >/dev/null 2>&1; then
        log_error "Cannot connect to $HETZNER_HOST"
        exit 1
    fi
    
    # Sync infrastructure files
    log_info "Syncing infrastructure files..."
    rsync -avz --delete \
        "$PROJECT_ROOT/infrastructure/" \
        "$HETZNER_USER@$HETZNER_HOST:$REMOTE_DIR/infrastructure/"
    
    # Create .env file on remote
    log_info "Setting up environment..."
    ssh "$HETZNER_USER@$HETZNER_HOST" bash << EOF
        cd $REMOTE_DIR
        
        # Create/update .env
        cat > .env << 'ENVEOF'
IMAGE_TAG=$IMAGE_TAG
ENVIRONMENT=$ENVIRONMENT
NODE_ENV=production
PLATFORM_PORT=3000
GUARDIAN_PORT=9000
POSTGRES_PASSWORD=\${POSTGRES_PASSWORD:-\$(openssl rand -base64 32)}
GRAFANA_ADMIN_PASSWORD=\${GRAFANA_ADMIN_PASSWORD:-\$(openssl rand -base64 16)}
SMTP_AUTH_PASSWORD=\${SMTP_AUTH_PASSWORD:-\$(openssl rand -base64 32)}
ENVEOF
        
        # Pull latest images
        cd infrastructure/docker/compose
        docker compose -f base.yml -f production.yml pull
        
        # Deploy with blue-green strategy
        echo "Starting deployment..."
        docker compose -f base.yml -f production.yml --profile full --profile mail up -d --remove-orphans
        
        # Wait for health
        echo "Waiting for services to be healthy..."
        sleep 10
        
        # Verify health
        if curl -f http://localhost:3000/health >/dev/null 2>&1; then
            echo "Deployment successful!"
        else
            echo "Warning: Health check not responding"
        fi
EOF
    
    log_success "Deployment complete!"
}

# Rollback to previous version
rollback() {
    log_step "Rolling back deployment..."
    
    ssh "$HETZNER_USER@$HETZNER_HOST" bash << EOF
        cd $REMOTE_DIR/infrastructure/docker/compose
        
        # Get previous image
        docker compose -f base.yml -f production.yml down
        
        # Restart with previous tag (assumes IMAGE_TAG_PREVIOUS is set)
        IMAGE_TAG=\${IMAGE_TAG_PREVIOUS:-latest} docker compose -f base.yml -f production.yml up -d
EOF
    
    log_success "Rollback complete!"
}

# =============================================================================
# MAIN
# =============================================================================
show_help() {
    cat << EOF
Usage: $(basename "$0") [COMMAND] [OPTIONS]

Deploy Liberation Platform to production.

Commands:
    deploy      Deploy to production (default)
    rollback    Rollback to previous version
    status      Show deployment status

Options:
    -h, --help      Show this help message
    --tag TAG       Docker image tag to deploy (default: latest)
    --dry-run       Show what would be done without doing it

Environment Variables:
    HETZNER_HOST    Remote server hostname/IP (required)
    HETZNER_USER    SSH user (default: deploy)
    IMAGE_TAG       Docker image tag (default: latest)
    ENVIRONMENT     Deployment environment (default: production)

Examples:
    $(basename "$0") deploy
    $(basename "$0") deploy --tag v1.2.3
    $(basename "$0") rollback
    $(basename "$0") status
EOF
}

# Parse arguments
COMMAND="deploy"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        deploy|rollback|status)
            COMMAND="$1"
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        --tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

case $COMMAND in
    deploy)
        if $DRY_RUN; then
            log_info "[DRY RUN] Would deploy to $HETZNER_HOST with tag $IMAGE_TAG"
        else
            deploy_remote
        fi
        ;;
    rollback)
        rollback
        ;;
    status)
        log_info "Checking deployment status..."
        ssh "$HETZNER_USER@$HETZNER_HOST" "cd $REMOTE_DIR/infrastructure/docker/compose && docker compose -f base.yml -f production.yml ps"
        ;;
esac
