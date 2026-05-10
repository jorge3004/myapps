#!/bin/bash
# Script para iniciar la aplicación catalog/backend

cd "$(dirname "$0")/apps/catalog/backend" || exit 1

if [ -f package.json ]; then
  echo "Iniciando catalog/backend (npm run dev)..."
  npm run dev
else
  echo "No se encontró package.json en apps/catalog/backend"
fi
