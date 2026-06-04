#!/bin/bash
set -e

echo "=== Setup da VPS para o Deriva PWA ==="
echo "Execute este script com privilégios de root (sudo su)."
echo "ATENÇÃO: Leia o script antes de executar, não execute cegamente!"

# 1. Update do sistema
apt update && apt upgrade -y

# 2. Instalar dependências base
apt install -y curl wget git build-essential nginx postgresql postgresql-contrib certbot python3-certbot-nginx

# 3. Instalar Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 4. Instalar PM2 globalmente
npm install -g pm2

# 5. Criar diretório base se não existir
mkdir -p /var/www

echo "=== Instalação de pacotes concluída! ==="
echo "Próximos passos:"
echo "1. Clone o repositório em /var/www/deriva-pwa"
echo "2. Configure o banco com scripts/create-db.sql"
echo "3. Configure o Nginx e Certbot"
