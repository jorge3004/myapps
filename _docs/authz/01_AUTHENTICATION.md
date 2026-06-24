# 01 - Authentication (Quien eres)
Ultima actualizacion: 2026-06-23

Authentication solo responde identidad.
No decide permisos de recursos.

## Entradas actuales

### Usuario
- Endpoint: POST /api/auth/login
- Valida username/email + password
- Resultado: token tipo user

### App
- Endpoint: POST /api/auth/token
- Valida apiKey activa
- Resultado: token tipo app

## Salida esperada

- Identidad validada
- Token firmado
- Contexto minimo para etapas siguientes (appId, type, userId/app)

## Lo que NO debe decidir esta capa

- Si puede entrar a app especifica (eso es capa de acceso de app)
- Si puede leer/escribir recursos (eso es authorization granular)
