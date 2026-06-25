# Scope Convention
Ultima actualizacion: 2026-06-24
Estado: active
Ambito: actual

Este documento pertenece al dominio de autorizacion (AuthZ).

## Formato

- `<appId>:<action>:<resource>`
- Wildcards permitidos: `*` (cualquier valor)

## Ejemplos

- `ratw3urj:read:users` - Leer usuarios en app ratw3urj
- `ratw3urj:write:catalogs` - Escribir catalogos en app ratw3urj
- `ratw3urj:*:*` - Acceso total dentro de app ratw3urj
- `*:*:users` - Cualquier app, cualquier accion, recurso users
- `*:*:*` - Superadmin global

## Buenas practicas

- Usar siempre appId (no nombre de app)
- Usar acciones y recursos descriptivos
- Usar wildcards solo cuando sea necesario
- Auditar cambios de scopes en endpoints administrativos

## Uso en API keys

```json
{
  "scopes": [
    "ratw3urj:read:users",
    "ratw3urj:write:catalogs",
    "ratw3urj:*:*"
  ]
}
```

## Referencias

- [AUTHZ_MODEL_V2.md](AUTHZ_MODEL_V2.md)
- [03_RESOURCE_AUTHORIZATION.md](03_RESOURCE_AUTHORIZATION.md)
