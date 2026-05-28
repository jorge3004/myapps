#!/bin/bash
# Script para iniciar el backend de catalog en TypeScript (backend-ts)

# Matar cualquier proceso en el puerto 4000 antes de iniciar
lsof -ti :4000 | xargs kill -9 2>/dev/null

cd "$(dirname "$0")/backend" || exit 1

npm run dev
