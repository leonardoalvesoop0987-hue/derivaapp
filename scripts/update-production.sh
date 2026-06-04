#!/usr/bin/env bash
set -e

cd /var/www/deriva-pwa

git pull
npm install
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 restart deriva-pwa
