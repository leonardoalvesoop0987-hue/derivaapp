#!/usr/bin/env bash
set -e

cd /var/www/deriva-pwa

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Aplicando DB Push e Seeds..."
npx prisma db push --accept-data-loss
npx prisma db seed || true

echo "Reiniciando aplicação no PM2..."
pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs
pm2 save

echo "Reiniciando Nginx para garantir que as rotas peguem a porta certa..."
nginx -t && systemctl reload nginx || true

echo "Configurando Certbot/SSL..."
certbot --nginx -d derivalove.duckdns.org --non-interactive --agree-tos -m leo@derivalove.duckdns.org || true

echo "Tudo pronto!"
