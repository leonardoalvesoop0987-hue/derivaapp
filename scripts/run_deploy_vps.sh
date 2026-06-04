#!/usr/bin/env bash
set -e
echo ">>> Extraindo projeto..."
mkdir -p /var/www/deriva-pwa
cd /var/www/deriva-pwa
tar -xzf /root/deploy.tar.gz

echo ">>> Configurando ENV..."
cp .env.production.example .env

echo ">>> Instalando Dependencias e Build..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

npm install --production=false
npx prisma generate

echo ">>> Configurando DB e Migrations..."
sudo -u postgres psql -f scripts/create-db.sql || true
npx prisma migrate deploy || true
npx prisma db seed || true

echo ">>> Build do app..."
npm run build

echo ">>> Configurando PM2..."
pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs
pm2 save

echo ">>> Configurando Nginx..."
cp deploy/nginx/deriva-pwa.conf /etc/nginx/sites-available/deriva-pwa || true
ln -s /etc/nginx/sites-available/deriva-pwa /etc/nginx/sites-enabled/ || true
nginx -t && systemctl reload nginx || true

echo ">>> Configurando Certbot/SSL..."
certbot --nginx -d derivalove.duckdns.org --non-interactive --agree-tos -m leo@derivalove.duckdns.org || true

echo "DEPLOY CONCLUIDO!"
