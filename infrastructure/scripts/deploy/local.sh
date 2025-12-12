#!/usr/bin/env bash
# Liberation Platform - Local Development Deployment
# Test Docker build and deployment locally before pushing

# Load common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/common.sh"

# =============================================================================
# CONFIGURATION
# =============================================================================
CONTAINER_NAME="liberation-platform-local"
IMAGE_NAME="liberation-platform:local"
PORT="${LOCAL_PORT:-3333}"
PROFILES="${PROFILES:-}"  # Empty = just platform, "full" = everything, "mail" = with postfix

# =============================================================================
# MAIN
# =============================================================================
main() {
    log_step "Building Liberation Platform locally..."
    
    cd "$PROJECT_ROOT"
    
    # Build the Docker image
    log_info "Building Docker image..."
    docker build -t "$IMAGE_NAME" -f infrastructure/docker/images/platform.Dockerfile .
    
    # Stop existing container if running
    log_info "Stopping existing containers..."
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
    
    # Determine which compose command to use
    local compose_cmd="docker compose -f infrastructure/docker/compose/base.yml -f infrastructure/docker/compose/development.yml"
    
    if [[ -n "$PROFILES" ]]; then
        for profile in $PROFILES; do
            compose_cmd="$compose_cmd --profile $profile"
        done
    fi
    
    # Run with docker compose for full stack, or direct docker run for simple case
    if [[ -n "$PROFILES" ]]; then
        log_info "Starting with profiles: $PROFILES"
        eval "$compose_cmd up -d"
    else
        log_info "Starting container (platform only)..."
        docker run -d \
            --name "$CONTAINER_NAME" \
            -p "$PORT:3000" \
            -e NODE_ENV=production \
            -e ENVIRONMENT=local \
            --health-cmd="node healthcheck.js" \
            --health-interval=30s \
            --health-timeout=3s \
            --health-retries=3 \
            "$IMAGE_NAME"
    fi
    
    # Wait for container to be healthy
    log_info "Waiting for container to be healthy..."
    if wait_for_service "$CONTAINER_NAME" 60; then
        log_success "Container is healthy!"
    else
        log_error "Container failed to become healthy"
        container_logs "$CONTAINER_NAME"
        exit 1
    fi
    
    # Test the health endpoint
    log_info "Testing health endpoint..."
    sleep 2
    if check_http "http://localhost:$PORT/api/health"; then
        log_success "Health check passed!"
    else
        log_warn "Health endpoint not responding (may be normal for some configurations)"
    fi
    
    echo ""
    log_success "Local deployment successful!"
    echo ""
    log_info "Open http://localhost:$PORT to view the app"
    echo ""
    log_info "Useful commands:"
    echo "  View logs:  docker logs $CONTAINER_NAME"
    echo "  Stop:       docker stop $CONTAINER_NAME"
    echo "  Shell:      docker exec -it $CONTAINER_NAME sh"
    echo "  Full stack: PROFILES=full $0"
    echo "  With mail:  PROFILES='full mail' $0"
}

# =============================================================================
# HELP
# =============================================================================
show_help() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Deploy Liberation Platform locally for development/testing.

Options:
    -h, --help      Show this help message
    -p, --port      Port to run on (default: 3333)
    --full          Start full stack (platform, guardian, redis, postgres)
    --mail          Include mail service (postfix)
    --monitoring    Include monitoring (prometheus, grafana)

Environment Variables:
    LOCAL_PORT      Port to run on (default: 3333)
    PROFILES        Docker compose profiles to activate
    DEBUG           Enable debug logging (true/false)

Examples:
    $(basename "$0")                    # Just platform
    $(basename "$0") --full             # Full stack
    $(basename "$0") --full --mail      # Full stack with mail
    PROFILES=full $(basename "$0")      # Full stack via env var
EOF
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        --full)
            PROFILES="${PROFILES} full"
            shift
            ;;
        --mail)
            PROFILES="${PROFILES} mail"
            shift
            ;;
        --monitoring)
            PROFILES="${PROFILES} monitoring"
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

main
