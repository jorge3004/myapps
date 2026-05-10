#!/bin/bash
# Script para agregar, commitear y hacer push a GitHub automáticamente

# Mensaje de commit automático con fecha y hora
DEFAULT_MSG="Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"

# Si se pasa argumento, usarlo como mensaje
if [ $# -gt 0 ]; then
  COMMIT_MSG="$*"
else
  # Pedir mensaje personalizado al usuario
  read -p "Mensaje de commit (deja vacío para automático): " USER_MSG
  if [ -z "$USER_MSG" ]; then
    COMMIT_MSG="$DEFAULT_MSG"
  else
    COMMIT_MSG="$USER_MSG"
  fi
fi

git add .
git commit -m "$COMMIT_MSG"
git push
