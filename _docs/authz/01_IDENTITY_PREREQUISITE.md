# 01 - Identity Prerequisite (AuthN dentro de AuthZ)
Ultima actualizacion: 2026-06-24
Estado: active
Ambito: actual

Este capitulo es un prerequisito del modelo de autorizacion por capas.
No reemplaza la documentacion principal de autenticacion en [../auth/README.md](../auth/README.md).

## Que responde esta capa

Solo responde identidad:
- quien es el sujeto (usuario o app)
- si el token/cadena de autenticacion es valida

No responde permisos de recursos.

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

## Referencias

- [../auth/README.md](../auth/README.md)
- [02_APP_ACCESS_GATE.md](02_APP_ACCESS_GATE.md)
- [03_RESOURCE_AUTHORIZATION.md](03_RESOURCE_AUTHORIZATION.md)
