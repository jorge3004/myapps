---
title: Arquitectura de revocación de API keys y ambientes
date: 2026-05-28
---

# Arquitectura de revocación de API keys y soporte multi-ambiente

## Decisión

- Se implementa endpoint global DELETE /api/apikeys/:apiKey para revocación (soft-delete) de API keys.
- El modelo ApiKey solo tiene un flag de revocación (revoked, revokedAt, revokedBy).
- El endpoint busca la clave en todas las apps del ambiente actual y la marca como revocada.
- El sistema está preparado para soportar múltiples ambientes (dev, prod, staging) usando distintas bases de datos según variable de entorno.
- Si en el futuro se requiere, se puede agregar un campo environment y filtrar por él.

## Ejemplo de endpoint

DELETE /api/apikeys/:apiKey

Headers:
- Authorization: Bearer {token_admin}

## Ejemplo de request

DELETE /api/apikeys/abcdef123456

## Ejemplo de response

{
  "success": true,
  "app": {
    "id": "123456",
    "name": "MiApp",
    "apiKeys": [
      {
        "apiKey": "abcdef123456",
        "revoked": true,
        "revokedAt": "2026-05-28T13:00:00.000Z",
        "revokedBy": "adminUserId"
      }
    ]
  }
}

## Notas

- Si la clave ya está revocada, responde error.
- Si no se encuentra, responde error.
- El endpoint está preparado para ambientes múltiples: solo hay que seleccionar el repositorio según variable de entorno.

---

_Diseño y documentación generados por GitHub Copilot el 2026-05-28._