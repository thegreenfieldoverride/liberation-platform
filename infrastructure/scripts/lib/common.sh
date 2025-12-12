#!/usr/bin/env bash
# Liberation Platform - Common Script Library
# Source this file in other scripts: source "$(dirname "$0")/lib/common.sh"

set -euo pipefail

# =============================================================================
# COLORS AND FORMATTING
# =============================================================================
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export BLUE='\033[0;34m'
export PURPLE='\033[0;35m'
export CYAN='\033[0;36m'
export WHITE='\033[1;37m'
export NC='\033[0m' # No Color
export BOLD='\033[1m'
export DIM='\033[2m'

# =============================================================================
# LOGGING FUNCTIONS
# =============================================================================
log_info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

log_debug() {
    if [[ "${DEBUG:-false}" == "true" ]]; then
        echo -e "${DIM}[DEBUG]${NC} $*"
    fi
}

log_step() {
    echo -e "${PURPLE}==>${NC} ${BOLD}$*${NC}"
}

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if running as root
require_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
}

# Check if running in Docker
in_docker() {
    [[ -f /.dockerenv ]] || grep -q docker /proc/1/cgroup 2>/dev/null
}

# Wait for a service to be healthy
wait_for_service() {
    local service="$1"
    local max_attempts="${2:-30}"
    local attempt=1
    
    log_info "Waiting for $service to be healthy..."
    while [[ $attempt -le $max_attempts ]]; do
        if docker inspect --format='{{.State.Health.Status}}' "$service" 2>/dev/null | grep -q "healthy"; then
            log_success "$service is healthy"
            return 0
        fi
        log_debug "Attempt $attempt/$max_attempts - $service not ready"
        sleep 2
        ((attempt++))
    done
    
    log_error "$service failed to become healthy after $max_attempts attempts"
    return 1
}

# Wait for a TCP port to be available
wait_for_port() {
    local host="$1"
    local port="$2"
    local max_attempts="${3:-30}"
    local attempt=1
    
    log_info "Waiting for $host:$port..."
    while [[ $attempt -le $max_attempts ]]; do
        if nc -z "$host" "$port" 2>/dev/null; then
            log_success "$host:$port is available"
            return 0
        fi
        log_debug "Attempt $attempt/$max_attempts - $host:$port not available"
        sleep 2
        ((attempt++))
    done
    
    log_error "$host:$port failed to become available after $max_attempts attempts"
    return 1
}

# =============================================================================
# DOCKER FUNCTIONS
# =============================================================================

# Get the project root directory
get_project_root() {
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    # Navigate up from infrastructure/scripts/lib to project root
    echo "$(cd "$script_dir/../../.." && pwd)"
}

# Get compose file path
get_compose_file() {
    local env="${1:-development}"
    local project_root
    project_root="$(get_project_root)"
    
    case "$env" in
        development|dev|local)
            echo "$project_root/infrastructure/docker/compose/development.yml"
            ;;
        production|prod)
            echo "$project_root/infrastructure/docker/compose/production.yml"
            ;;
        base)
            echo "$project_root/infrastructure/docker/compose/base.yml"
            ;;
        *)
            log_error "Unknown environment: $env"
            return 1
            ;;
    esac
}

# Run docker compose with proper file paths
docker_compose() {
    local env="${ENVIRONMENT:-development}"
    local project_root
    project_root="$(get_project_root)"
    local base_file="$project_root/infrastructure/docker/compose/base.yml"
    local env_file
    env_file="$(get_compose_file "$env")"
    
    docker compose -f "$base_file" -f "$env_file" "$@"
}

# Check if a container is running
container_running() {
    local container="$1"
    docker ps --format '{{.Names}}' | grep -q "^${container}$"
}

# Get container logs
container_logs() {
    local container="$1"
    local lines="${2:-100}"
    docker logs --tail "$lines" "$container"
}

# =============================================================================
# ENVIRONMENT FUNCTIONS
# =============================================================================

# Load environment file
load_env() {
    local env_file="${1:-.env}"
    if [[ -f "$env_file" ]]; then
        log_debug "Loading environment from $env_file"
        set -a
        # shellcheck source=/dev/null
        source "$env_file"
        set +a
    fi
}

# Check required environment variables
require_env() {
    local var_name="$1"
    if [[ -z "${!var_name:-}" ]]; then
        log_error "Required environment variable $var_name is not set"
        exit 1
    fi
}

# =============================================================================
# HEALTH CHECK FUNCTIONS
# =============================================================================

# Check HTTP endpoint
check_http() {
    local url="$1"
    local expected_code="${2:-200}"
    local timeout="${3:-5}"
    
    local response_code
    response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url" 2>/dev/null || echo "000")
    
    if [[ "$response_code" == "$expected_code" ]]; then
        return 0
    else
        return 1
    fi
}

# Full health check for liberation platform
health_check() {
    local all_healthy=true
    
    log_step "Running health checks..."
    
    # Platform
    if check_http "http://localhost:${PLATFORM_PORT:-3000}/health"; then
        log_success "Liberation Platform: healthy"
    else
        log_error "Liberation Platform: unhealthy"
        all_healthy=false
    fi
    
    # Guardian (if running)
    if container_running "liberation-guardian"; then
        if check_http "http://localhost:${GUARDIAN_PORT:-9000}/health"; then
            log_success "Liberation Guardian: healthy"
        else
            log_error "Liberation Guardian: unhealthy"
            all_healthy=false
        fi
    fi
    
    # Redis (if running)
    if container_running "liberation-redis"; then
        if docker exec liberation-redis redis-cli ping | grep -q PONG; then
            log_success "Redis: healthy"
        else
            log_error "Redis: unhealthy"
            all_healthy=false
        fi
    fi
    
    # Postfix (if running)
    if container_running "liberation-postfix"; then
        if docker exec liberation-postfix postfix status >/dev/null 2>&1; then
            log_success "Postfix: healthy"
        else
            log_error "Postfix: unhealthy"
            all_healthy=false
        fi
    fi
    
    if $all_healthy; then
        log_success "All services healthy"
        return 0
    else
        log_error "Some services unhealthy"
        return 1
    fi
}

# =============================================================================
# CLEANUP FUNCTIONS
# =============================================================================

# Cleanup on exit
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log_error "Script exited with code $exit_code"
    fi
    # Add any cleanup tasks here
}

# Register cleanup handler
trap cleanup EXIT

# =============================================================================
# SCRIPT INITIALIZATION
# =============================================================================

# Initialize common variables
PROJECT_ROOT="$(get_project_root)"
export PROJECT_ROOT

log_debug "Common library loaded from $PROJECT_ROOT"
