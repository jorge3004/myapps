#!/bin/bash
# Script para iniciar la aplicación catalog/frontend

cd "$(dirname "$0")/apps/catalog/frontend" || exit 1

if [ -f package.json ]; then
  echo "Iniciando catalog/frontend (npm start)..."
  npm start
else
  echo "No se encontró package.json en apps/catalog/frontend"
fi
