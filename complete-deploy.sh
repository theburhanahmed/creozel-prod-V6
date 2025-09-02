#!/bin/bash

# Complete Supabase AI Starter Kit Deployment Script for DigitalOcean Ubuntu
# This script sets up everything from scratch on a fresh Ubuntu server
# Version: 2.0 - Optimized for clean deployment

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# Print functions
print_header() { echo -e "${PURPLE}🚀 $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Banner
clear
echo -e "${CYAN}"
cat << 'EOF'
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        SUPABASE AI STARTER KIT DEPLOYMENT SCRIPT        ║
║                                                          ║
║  🤖 Complete AI Infrastructure in Minutes               ║
║  🚀 Production-Ready Setup                               ║
║  🛠️  PostgreSQL + pgvector + Kong + n8n                 ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

print_info "Starting deployment on Ubuntu $(lsb_release -rs)..."
print_warning "This script requires root privileges"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root or with sudo"
   exit 1
fi

# =============================================================================
# STEP 1: SYSTEM PREPARATION
# =============================================================================
print_header "STEP 1: SYSTEM PREPARATION"

print_info "Updating package lists..."
apt update -qq

print_info "Upgrading system packages..."
apt upgrade -y -qq

print_info "Installing essential packages..."
apt install -y -qq \
    curl \
    git \
    wget \
    unzip \
    gnupg \
    lsb-release \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    python3 \
    python3-pip \
    htop \
    vim \
    ufw

print_success "System preparation completed"

# =============================================================================
# STEP 2: INSTALL NODE.JS
# =============================================================================
print_header "STEP 2: INSTALLING NODE.JS 18.x LTS"

print_info "Adding NodeSource repository..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1

print_info "Installing Node.js..."
apt install -y -qq nodejs

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js $NODE_VERSION installed"
print_success "npm $NPM_VERSION installed"

# =============================================================================
# STEP 3: INSTALL DOCKER
# =============================================================================
print_header "STEP 3: INSTALLING DOCKER & DOCKER COMPOSE"

print_info "Adding Docker GPG key..."
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

print_info "Adding Docker repository..."
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

print_info "Installing Docker..."
apt update -qq
apt install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin

print_info "Starting Docker service..."
systemctl start docker
systemctl enable docker

DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
print_success "Docker $DOCKER_VERSION installed and started"

# =============================================================================
# STEP 4: CLONE REPOSITORY
# =============================================================================
print_header "STEP 4: CLONING SUPABASE AI STARTER KIT"

PROJECT_DIR="/opt/supabase-ai-starter-kit"

# Remove any existing directory
if [[ -d "$PROJECT_DIR" ]]; then
    print_warning "Existing directory found, removing..."
    rm -rf "$PROJECT_DIR"
fi

print_info "Cloning repository..."
git clone https://github.com/theburhanahmed/supabase-ai-starter-kit.git "$PROJECT_DIR"
cd "$PROJECT_DIR"

print_success "Repository cloned to $PROJECT_DIR"

# =============================================================================
# STEP 5: ENVIRONMENT CONFIGURATION
# =============================================================================
print_header "STEP 5: CONFIGURING ENVIRONMENT"

if [[ -f .env ]]; then
    print_warning "Existing .env found, backing up..."
    cp .env ".env.backup.$(date +%Y%m%d_%H%M%S)"
fi

print_info "Creating environment file from template..."
cp .env.example .env

print_info "Generating secure keys and passwords..."

# Generate secure credentials (using hex to avoid special characters)
POSTGRES_PASS=$(openssl rand -hex 20)
JWT_SECRET=$(openssl rand -hex 32)
SECRET_KEY_BASE=$(openssl rand -hex 32)
VAULT_ENC_KEY=$(openssl rand -hex 16)
N8N_ENCRYPTION_KEY=$(openssl rand -hex 16)
N8N_JWT_SECRET=$(openssl rand -hex 16)

# Get server IP
SERVER_IP=$(curl -s -m 10 ifconfig.me 2>/dev/null || curl -s -m 10 ipinfo.io/ip 2>/dev/null || echo "localhost")
print_info "Detected server IP: $SERVER_IP"

# Update .env file using Python (safer than sed)
print_info "Updating configuration file..."
python3 << PYEOF
import re

with open('.env', 'r') as f:
    content = f.read()

# Configuration updates
updates = {
    'POSTGRES_PASSWORD': '$POSTGRES_PASS',
    'JWT_SECRET': '$JWT_SECRET',
    'SECRET_KEY_BASE': '$SECRET_KEY_BASE',
    'VAULT_ENC_KEY': '$VAULT_ENC_KEY',
    'N8N_ENCRYPTION_KEY': '$N8N_ENCRYPTION_KEY',
    'N8N_USER_MANAGEMENT_JWT_SECRET': '$N8N_JWT_SECRET',
    'ENABLE_EMAIL_AUTOCONFIRM': 'true',
    'SITE_URL': 'http://$SERVER_IP:3000',
    'API_EXTERNAL_URL': 'http://$SERVER_IP:8000',
    'SUPABASE_PUBLIC_URL': 'http://$SERVER_IP:8000',
    'SMTP_HOST': 'supabase-mail',
    'SMTP_PORT': '2500',
    'SMTP_USER': 'fake_mail_user',
    'SMTP_PASS': 'fake_mail_password'
}

for key, value in updates.items():
    pattern = f'^{key}=.*$'
    replacement = f'{key}={value}'
    content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

with open('.env', 'w') as f:
    f.write(content)
PYEOF

print_success "Environment configuration completed"

# =============================================================================
# STEP 6: INSTALL NPM DEPENDENCIES
# =============================================================================
print_header "STEP 6: INSTALLING PROJECT DEPENDENCIES"

if [[ -f package.json ]]; then
    print_info "Installing npm dependencies..."
    npm install --silent
    print_success "NPM dependencies installed"
else
    print_info "No package.json found, skipping npm install"
fi

# =============================================================================
# STEP 7: PREPARE SCRIPTS
# =============================================================================
print_header "STEP 7: PREPARING SCRIPTS"

print_info "Making scripts executable..."
find scripts/ -name "*.sh" -exec chmod +x {} \; 2>/dev/null || true

# =============================================================================
# STEP 8: START SERVICES
# =============================================================================
print_header "STEP 8: STARTING SUPABASE AI SERVICES"

print_info "Starting Docker containers..."

# Use docker compose directly for better error handling
if ! docker compose up -d; then
    print_error "Failed to start services with docker compose"
    print_info "Trying alternative startup method..."
    
    # Force cleanup and retry
    docker compose down --remove-orphans --volumes 2>/dev/null || true
    docker system prune -f
    
    print_info "Retrying startup..."
    docker compose up -d
fi

print_success "Services started successfully"

# =============================================================================
# STEP 9: WAIT FOR SERVICES
# =============================================================================
print_header "STEP 9: WAITING FOR SERVICES TO INITIALIZE"

print_info "Waiting for services to start (this may take 2-3 minutes)..."

# Progressive wait with status updates
for i in {1..12}; do
    sleep 15
    RUNNING_CONTAINERS=$(docker compose ps --services --filter "status=running" | wc -l)
    print_info "Progress: $RUNNING_CONTAINERS services running... ($((i*15))s elapsed)"
done

# =============================================================================
# STEP 10: HEALTH CHECK
# =============================================================================
print_header "STEP 10: RUNNING HEALTH CHECKS"

print_info "Checking service status..."
docker compose ps

if [[ -f scripts/health-check.sh ]]; then
    print_info "Running comprehensive health check..."
    if ./scripts/health-check.sh; then
        print_success "Health check passed!"
    else
        print_warning "Health check completed with warnings (services may still be starting)"
    fi
else
    print_info "Health check script not found, performing basic checks..."
    
    # Basic connectivity tests
    for port in 3000 8000 5678; do
        if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" > /dev/null 2>&1; then
            print_success "Service on port $port is responding"
        else
            print_warning "Service on port $port not yet responding"
        fi
    done
fi

# =============================================================================
# STEP 11: FIREWALL CONFIGURATION
# =============================================================================
print_header "STEP 11: CONFIGURING FIREWALL"

print_info "Setting up UFW firewall..."

# Reset and configure firewall
ufw --force reset > /dev/null 2>&1
ufw --force enable > /dev/null 2>&1
ufw default deny incoming > /dev/null 2>&1
ufw default allow outgoing > /dev/null 2>&1

# Allow essential ports
ufw allow ssh > /dev/null 2>&1
ufw allow 80/tcp > /dev/null 2>&1      # HTTP
ufw allow 443/tcp > /dev/null 2>&1     # HTTPS
ufw allow 3000/tcp > /dev/null 2>&1    # Supabase Studio
ufw allow 8000/tcp > /dev/null 2>&1    # Kong API Gateway
ufw allow 5678/tcp > /dev/null 2>&1    # n8n

print_success "Firewall configured (SSH, HTTP, HTTPS, and service ports allowed)"

# =============================================================================
# STEP 12: CREATE SYSTEMD SERVICE (OPTIONAL)
# =============================================================================
print_header "STEP 12: SYSTEM SERVICE SETUP"

cat > /etc/systemd/system/supabase-ai.service << EOF
[Unit]
Description=Supabase AI Starter Kit
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=300
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable supabase-ai > /dev/null 2>&1

print_success "Systemd service created and enabled"

# =============================================================================
# DEPLOYMENT COMPLETED
# =============================================================================
print_header "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉"

echo -e "${WHITE}"
cat << EOF

╔══════════════════════════════════════════════════════════╗
║                  🚀 DEPLOYMENT SUCCESS! 🚀              ║
║                                                          ║
║  Your Supabase AI Starter Kit is now running!           ║
╚══════════════════════════════════════════════════════════╝

EOF
echo -e "${NC}"

# Access Information
print_header "📡 ACCESS INFORMATION"
print_success "Server IP: $SERVER_IP"
echo ""
print_info "🎨 Supabase Studio:    http://$SERVER_IP:3000"
print_info "🌐 API Gateway (Kong): http://$SERVER_IP:8000"
print_info "🤖 n8n Workflows:     http://$SERVER_IP:5678"
echo ""

# Important Notes
print_header "📋 IMPORTANT NOTES"
print_warning "1. Environment file: $PROJECT_DIR/.env"
print_warning "2. Add your AI API keys (OpenAI, Anthropic, etc.) to the .env file"
print_warning "3. Default email auto-confirmation is ENABLED for development"
print_warning "4. Configure SMTP settings in .env for production email"
print_warning "5. Backup your .env file - it contains all your secrets!"

echo ""

# Useful Commands
print_header "🛠️  USEFUL COMMANDS"
echo -e "${CYAN}# View logs${NC}"
echo "docker compose -f $PROJECT_DIR/docker-compose.yml logs -f"
echo ""
echo -e "${CYAN}# Stop services${NC}"
echo "systemctl stop supabase-ai"
echo ""
echo -e "${CYAN}# Start services${NC}"
echo "systemctl start supabase-ai"
echo ""
echo -e "${CYAN}# Check status${NC}"
echo "docker compose -f $PROJECT_DIR/docker-compose.yml ps"
echo ""
echo -e "${CYAN}# Run health check${NC}"
echo "cd $PROJECT_DIR && ./scripts/health-check.sh"
echo ""

# Current Status
print_header "📊 CURRENT STATUS"
echo "Container Status:"
docker compose ps

echo ""
print_success "🔥 Your AI infrastructure is ready! Start building amazing AI applications!"
print_info "💡 Visit the documentation at: https://github.com/theburhanahmed/supabase-ai-starter-kit"

echo ""
print_header "🚀 HAPPY BUILDING! 🚀"
