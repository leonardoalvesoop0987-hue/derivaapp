#!/bin/bash

###############################################################################
# DEPLOY SCRIPT - Deriva PWA
# Execute este script DENTRO da VPS para fazer o deploy completo
#
# Uso: chmod +x deploy-vps.sh && ./deploy-vps.sh
###############################################################################

set -e  # Exit on error

echo "=========================================="
echo "🚀 Iniciando Deploy - Deriva PWA"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/deriva/app"
LOG_FILE="/tmp/deriva-deploy.log"

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    error "Diretório $APP_DIR não encontrado!"
fi

cd "$APP_DIR"
log "Diretório de trabalho: $(pwd)"

# Step 1: Pull latest changes
log ""
log "1️⃣  Atualizando código do GitHub..."
git fetch origin main || error "Falha ao fazer fetch"
git reset --hard HEAD || error "Falha ao resetar"
git pull origin main || error "Falha ao fazer pull"
log "✅ Código atualizado com sucesso"

# Step 2: Install dependencies
log ""
log "2️⃣  Instalando dependências..."
npm install || error "Falha ao instalar dependências"
log "✅ Dependências instaladas"

# Step 3: Run migrations
log ""
log "3️⃣  Executando migrações do Prisma..."
npx prisma generate || error "Falha ao gerar Prisma"
npx prisma migrate deploy || error "Falha nas migrações"
log "✅ Migrações completadas"

# Step 4: Build
log ""
log "4️⃣  Compilando aplicação..."
npm run build || error "Falha na compilação"
log "✅ Build completado com sucesso"

# Step 5: Restart PM2
log ""
log "5️⃣  Reiniciando aplicação com PM2..."
pm2 restart deriva-pwa || error "Falha ao reiniciar PM2"
sleep 2
pm2 save || warning "Falha ao salvar PM2"
log "✅ Aplicação reiniciada"

# Step 6: Show status
log ""
log "6️⃣  Status do PM2..."
pm2 status || warning "Falha ao obter status"

# Step 7: Show logs
log ""
log "7️⃣  Últimas linhas do log..."
pm2 logs deriva-pwa --lines 20 --nostream || warning "Falha ao obter logs"

# Final summary
log ""
echo "=========================================="
log "✅ DEPLOY COMPLETADO COM SUCESSO!"
echo "=========================================="
echo ""
log "Informações:"
log "  - URL: https://derivalove.duckdns.org"
log "  - Diretório: $APP_DIR"
log "  - Porta: 3002"
log "  - Log completo: $LOG_FILE"
echo ""
log "Próximos passos:"
log "  1. Verificar logs: pm2 logs deriva-pwa"
log "  2. Testar URL: curl -I https://derivalove.duckdns.org"
log "  3. Monitorar: pm2 monit"
echo ""
