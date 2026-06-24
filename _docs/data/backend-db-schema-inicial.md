# Decisiones de diseño — Esquema de base de datos

> El DDL y seed están en `backend/migrations/`. Este archivo explica el **por qué** de las decisiones de diseño.

## Convenciones generales
- IDs: `VARCHAR(32)` generado con `crypto.randomUUID()` truncado — no `AUTO_INCREMENT`.
  Razón: portabilidad entre ambientes sin coordinación de secuencias.
- Nombres de tablas y columnas: `snake_case` en DB → mapeados a `camelCase` en JS por las funciones `mapXxxRow()` en `src/models/`.
- JSON columns (`scopes`, `revoked_scopes`): MySQL devuelve estos como strings en algunas configuraciones; siempre pasar por `parseJsonArray()` al leer.

## bcrypt vs JWT (frecuentemente confundidos)

| | bcrypt | JWT |
|---|---|---|
| Propósito | Hashear contraseñas | Firmar/verificar tokens |
| Secret global | No necesita ninguno | Usa `JWT_SECRET` del `.env` |
| Salt | Generado automáticamente, embebido en el hash | N/A |
| Verificación | `bcrypt.compare(plain, hash)` | `jwt.verify(token, JWT_SECRET)` |

No existe relación entre `JWT_SECRET` y el hash de contraseñas. Son mecanismos independientes.

## Scopes y roles

Los scopes del JWT **no se guardan** directamente en `users.scopes` para la sesión — se derivan en runtime:
1. Login → `getUserAppRoles(userId)` consulta `user_apps`
2. `deriveScopes(user, rolesPorApp, appIds)` aplica el mapa `ROLE_SCOPES` de `authRoutes.ts`
3. El resultado se firma en el JWT

`users.scopes` funciona como override manual (admin puede forzar scopes custom).
`users.revoked_scopes` permite revocar scopes individuales sin cambiar el rol.

## Orden de ejecución en DBeaver

```
1. 20260529_create_users_table.sql
2. 20260529_create_user_apps_table.sql
3. 20260601_create_apps_api_keys.sql
4. 20260601_seed_dev.sql          ← idempotente, re-ejecutable
```
