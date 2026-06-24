# 03 - Resource Authorization (Que puedes hacer)
Ultima actualizacion: 2026-06-23

Esta capa responde: "que accion puede ejecutar dentro de la app?"

## Scope format

<appId>:<action>:<resource>

Ejemplos:
- 795145432d094d5f:read:users
- 795145432d094d5f:write:catalogs
- *:*:*

## Construccion de permisos efectivos (usuario)

1. Scopes por role de app (ROLE_SCOPES)
2. + scopes directos en users.scopes
3. - users.revokedScopes
4. Resultado final -> requireScope

## Construccion para app token

1. Scopes de api key/token app
2. Evaluacion en requireScope

## Middleware

- verify token (tipo user o app)
- requireScope para endpoint protegido

Si no cumple patrones permitidos -> 403 Insufficient scope
