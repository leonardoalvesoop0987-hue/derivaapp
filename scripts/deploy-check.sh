#!/bin/bash
set -e

echo "=== Deploy Check Local/Server ==="

echo "1. Checking Node.js..."
node -v || { echo "Node.js is not installed."; exit 1; }

echo "2. Checking npm..."
npm -v || { echo "npm is not installed."; exit 1; }

echo "3. Running npm install..."
npm install

echo "4. Checking Prisma (validate)..."
npx prisma validate

echo "5. Checking Prisma (generate)..."
npx prisma generate

echo "6. Running Build..."
npm run build

echo "=== All checks passed successfully! ==="
