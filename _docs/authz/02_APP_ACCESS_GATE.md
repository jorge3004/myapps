# 02 - App Access Gate (A que app puedes entrar)
Ultima actualizacion: 2026-06-23

Esta capa responde: "puede entrar a esta app?"

## Usuario

Fuente de verdad:
- user_apps (user_id, app_id, role)

Regla:
- Si no existe relacion user-app, login con appId devuelve 403.

## App token (api key)

Fuente de verdad:
- api key valida y asociada a app

Regla:
- Si la api key no existe/no esta activa/no corresponde, no hay token valido.

## Nota importante

Role en user_apps no solo es metadata:
- define perfil minimo dentro de la app
- habilita derivacion de scopes por role

## Endpoint operativo

- POST /api/users/:userId/apps
  - body: { appId, role? }
  - role default: user

- DELETE /api/users/:userId/apps/:appId
  - remueve acceso de app
