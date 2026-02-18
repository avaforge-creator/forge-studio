#!/bin/bash
# Forge AI Studio Health Monitor

check_status() {
    echo "=== Forge AI Studio Status ==="
    pm2 list | grep -E "(forge|━━)"
    echo ""
    
    # Check if server responds
    if curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000 | grep -q "200"; then
        echo "✅ Server: Responding (HTTP 200)"
    else
        echo "❌ Server: Not responding"
    fi
    
    # Check tunnel
    if pm2 list | grep -q "forge-ai-tunnel.*online"; then
        echo "✅ Tunnel: Active"
    else
        echo "❌ Tunnel: Down"
    fi
}

case "${1:-status}" in
    status) check_status ;;
    restart)
        echo "Restarting all services..."
        pm2 restart all
        sleep 3
        check_status
        ;;
    logs)
        pm2 logs forge-ai-studio --lines 20 --nostream
        ;;
    *)
        echo "Usage: $0 {status|restart|logs}"
        ;;
esac
