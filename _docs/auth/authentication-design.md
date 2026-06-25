# Diseño de autenticación multi-app

## Principios
- El backend central soporta múltiples aplicaciones (apps) y usuarios.
- Los endpoints de autenticación distinguen el contexto de aplicación mediante un parámetro `appId` (o similar).
- Si no se especifica `appId`, se asume la app por defecto (`default`).
- El JWT emitido siempre incluye el `appId`.
- Los endpoints protegidos validan el token y extraen el contexto de app.

## Endpoints

### POST /api/auth/login
- Autentica usuario en el contexto de una app.
- Body:
  ```json
  {
    "username": "...",
    "password": "...",
    "appId": "catalog" // opcional, default si no se envía
  }
  ```
- Responde con JWT que incluye `appId`.

### POST /api/auth/token
- Autentica una app vía apiKey.
- Body:
  ```json
  {
    "apiKey": "..."
  }
  ```
- El backend busca la app correspondiente y emite JWT con `appId`.

## Notas
- El backend central expone rutas planas: `/api/users`, `/api/apps`, `/api/auth`.
- El middleware de autorización extrae el contexto de app del JWT.
- Si se autentica sin `appId`, se asume la app por defecto.
- El campo de usuario para login es `username` (no `email`).
- Para el modelo completo de autorizacion (acceso a app + permisos granulares), ver [../authz/AUTHZ_MODEL_V2.md](../authz/AUTHZ_MODEL_V2.md).
