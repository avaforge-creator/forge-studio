#!/bin/bash
# Forge AI Studio Startup Script
# Manages both Vite preview and Cloudflared tunnel with automatic restart

set -e

APP_DIR="/home/nikan/.openclaw/workspace/Forge-AI-Studio"
LOG_DIR="$APP_DIR/logs"

mkdir -p "$LOG_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:mm:%S')] $1"
}

# Kill any existing processes
kill_existing() {
    log "Cleaning up existing processes..."
    pm2 delete forge-ai-studio 2>/dev/null || true
    pm2 delete forge-ai-tunnel 2>/dev/null || true
    sleep 1
}

# Start everything with pm2
start() {
    log "Starting Forge AI Studio..."
    cd "$APP_DIR"
    pm2 resurrect 2>/dev/null || pm2 start ecosystem.config.cjs
}

# Main
case "${1:-start}" in
    start)
        kill_existing
        start
        sleep 3
        log "Status:"
        pm2 list
        log "Forge AI Studio is now running 24/7!"
        ;;
    stop)
        kill_existing
        log "All processes stopped"
        ;;
    restart)
        kill_existing
        sleep 2
        start
        ;;
    status)
        pm2 list
        ;;
    logs)
        pm2 logs forge-ai-studio --lines 50 --nostream
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac
