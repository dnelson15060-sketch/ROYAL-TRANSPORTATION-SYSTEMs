#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Royal Transportation System — Local Development Startup Script
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$REPO_ROOT/backend"
ADMIN_DIR="$REPO_ROOT/admin_dashboard"
MOBILE_DIR="$REPO_ROOT/mobile_app"

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()    { echo -e "${BLUE}[RTS]${NC} $*"; }
success(){ echo -e "${GREEN}[RTS] ✓${NC} $*"; }
warn()   { echo -e "${YELLOW}[RTS] ⚠${NC} $*"; }
error()  { echo -e "${RED}[RTS] ✗${NC} $*"; exit 1; }

# ── Prerequisites check ───────────────────────────────────────────────────────
log "Checking prerequisites..."

command -v node >/dev/null 2>&1 || error "Node.js is not installed. Install from https://nodejs.org"
command -v npm  >/dev/null 2>&1 || error "npm is not installed."

NODE_VER=$(node -v | cut -dv -f2 | cut -d. -f1)
[[ "$NODE_VER" -ge 18 ]] || error "Node.js 18+ required. Current: $(node -v)"

success "Node.js $(node -v) detected"

# ── Backend setup ─────────────────────────────────────────────────────────────
log "Setting up backend..."

if [[ ! -f "$BACKEND_DIR/.env" ]]; then
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  warn "Created backend/.env from .env.example — update with your Firebase credentials!"
fi

cd "$BACKEND_DIR"
npm install --silent
success "Backend dependencies installed"

# ── Admin dashboard setup ─────────────────────────────────────────────────────
log "Setting up admin dashboard..."

if [[ ! -f "$ADMIN_DIR/.env" ]]; then
  cp "$ADMIN_DIR/.env.example" "$ADMIN_DIR/.env"
  warn "Created admin_dashboard/.env from .env.example — update with your Firebase config!"
fi

cd "$ADMIN_DIR"
npm install --silent
success "Admin dashboard dependencies installed"

# ── Mobile app check ──────────────────────────────────────────────────────────
if command -v flutter >/dev/null 2>&1; then
  log "Setting up Flutter mobile app..."
  cd "$MOBILE_DIR"
  if [[ ! -f ".env" ]]; then
    cp ".env.example" ".env" 2>/dev/null || true
    warn "Created mobile_app/.env from .env.example — update with your config!"
  fi
  flutter pub get --quiet
  success "Flutter dependencies installed"
else
  warn "Flutter not found. Skipping mobile app setup. Install from https://flutter.dev"
fi

# ── Start services ────────────────────────────────────────────────────────────
log "Starting services..."

# Start backend in background
cd "$BACKEND_DIR"
npm run dev &
BACKEND_PID=$!
log "Backend starting (PID: $BACKEND_PID) on http://localhost:3000"

sleep 3

# Start admin dashboard in background
cd "$ADMIN_DIR"
npm run dev &
ADMIN_PID=$!
log "Admin dashboard starting (PID: $ADMIN_PID) on http://localhost:5173"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
success "Royal Transportation System is starting up!"
echo ""
echo "  📡 Backend API:       http://localhost:3000/api/v1"
echo "  🌐 Admin Dashboard:   http://localhost:5173"
echo "  📱 Mobile App:        Run 'flutter run' in mobile_app/"
echo ""
echo "  📋 API Health Check:  http://localhost:3000/api/v1/health"
echo ""
echo "  To seed demo data:    cd backend && npm run seed"
echo "  To run tests:         cd backend && npm test"
echo "                        cd admin_dashboard && npm test"
echo "                        cd mobile_app && flutter test"
echo ""
echo "  Press Ctrl+C to stop all services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Cleanup on exit ───────────────────────────────────────────────────────────
cleanup() {
  log "Stopping services..."
  kill "$BACKEND_PID" 2>/dev/null || true
  kill "$ADMIN_PID"   2>/dev/null || true
  success "All services stopped."
}
trap cleanup EXIT INT TERM

wait
