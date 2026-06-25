# Guia de endpoints para pruebas en Insomnia
Ultima actualizacion: 2026-06-18
Estado: active
Ambito: actual

Historial de cambios:
- Ver [IMPLEMENTATION_TIMELINE.md](../navigation/IMPLEMENTATION_TIMELINE.md)

Servidor activo:
- Uno solo: [backend/src/index.ts](../../backend/src/index.ts)
- Base URL: `http://localhost:4000/api`

Nota de alcance:
- Esta guia es el inventario rapido de endpoints.
- Si un endpoint tiene documentacion contextual adicional, se marca en la columna `Contexto`.

Pendiente de validacion funcional:
- `GET /api/users/by-username/:username` (ver [backend/src/routes/userRoutes.ts](../../backend/src/routes/userRoutes.ts#L27)).

---

## Headers runtime opcionales

| Header | Valores |
|---|---|
| x-runtime-env | dev, prod |
| x-data-source | mysql, memory |

Headers de respuesta de trazabilidad:
- `x-runtime-env-requested`
- `x-runtime-env-served`
- `x-data-source-requested`
- `x-data-source-served`
- `x-data-source-fallback`
- `x-data-source-mysql-available`

---

## Tabla maestra de endpoints

Leyenda de `Estado prueba`:
- `pendiente`: aun no probado en Insomnia
- `ok`: probado y funcionando como esperado
- `fallo`: probado, pero devolvio error inesperado

## Vista rapida por categoria

### health/runtime
- GET /api/health
- GET /api/runtime/status

### auth
- POST /api/auth/login
- POST /api/auth/token

### users
- GET /api/users
- POST /api/users
- GET /api/users/by-email/:email
- GET /api/users/by-username/:username
- GET /api/users/:userId
- GET /api/users/:userId/apps
- POST /api/users/:userId/apps
- DELETE /api/users/:userId/apps/:appId
- GET /api/users/:userId/scopes
- POST /api/users/:userId/scopes
- DELETE /api/users/:userId/scopes
- POST /api/users/:userId/revoked-scopes
- DELETE /api/users/:userId/revoked-scopes

### apps
- GET /api/apps
- POST /api/apps
- POST /api/apps/:appId/apikeys
- POST /api/apps/:appId/apikeys/:apiKey/revoke
- DELETE /api/apps/apikeys/:apiKey

### audit-logs
- GET /api/audit-logs

### catalog
- /api/catalog/* (sin endpoints implementados actualmente)

Tip de lectura rapida:
- Si quieres ver todos los endpoints de corrido, recorre solo la columna `Endpoint`.

| Grupo | Metodo | Endpoint | Auth | Descripcion breve | Contexto | Estado prueba |
|---|---|---|---|---|---|---|
| health/runtime | GET | `/api/health` | No | Health check general del servidor. | - | ok |
| health/runtime | GET | `/api/health/data-source` | No | ~~Eliminado — contenido absorbido por `/api/runtime/status`~~ | - | - |
| health/runtime | GET | `/api/runtime/status` | No | Estado runtime completo: contexto dinámico, política, decisiones y health check MySQL. | [RUNTIME_STATUS_ENDPOINT.md](../runtime/RUNTIME_STATUS_ENDPOINT.md), [next-steps.md](../navigation/next-steps.md) | ok |
| auth | POST | `/api/auth/login` | No | Login de usuario, emite JWT. | [authentication-design.md](../auth/authentication-design.md) | pendiente |
| auth | POST | `/api/auth/token` | No | Intercambia API key por token tipo app. | [authentication-design.md](../auth/authentication-design.md), [APIKEYS_ENDPOINTS.md](../auth/APIKEYS_ENDPOINTS.md) | pendiente |
| users | GET | `/api/users` | Bearer + scope | Lista usuarios (paginado). | [SCOPE_CONVENTION.md](../authz/SCOPE_CONVENTION.md) | pendiente |
| users | POST | `/api/users` | Bearer + scope | Crea usuario y opcionalmente asigna apps/roles por app. | [backend-db-relacion-usuarios-apps.md](../data/backend-db-relacion-usuarios-apps.md) | pendiente |
| users | GET | `/api/users/by-email/:email` | No (actual) | Busca usuario por email. | - | pendiente |
| users | GET | `/api/users/by-username/:username` | No (actual) | Busca usuario por username (pendiente validar handler real). | [backend/src/routes/userRoutes.ts](../../backend/src/routes/userRoutes.ts#L27) | pendiente |
| users | GET | `/api/users/:userId` | No (actual) | Obtiene usuario por ID. | - | pendiente |
| users | GET | `/api/users/:userId/apps` | No (actual) | Lista apps permitidas del usuario. | [backend-db-relacion-usuarios-apps.md](../data/backend-db-relacion-usuarios-apps.md) | pendiente |
| users | POST | `/api/users/:userId/apps` | Bearer + scope | Asigna o actualiza acceso del usuario a una app (crea/actualiza en `user_apps`). `role` es opcional y por defecto queda `user`. | [backend-db-relacion-usuarios-apps.md](../data/backend-db-relacion-usuarios-apps.md), [USERS_TEST_README.md](USERS_TEST_README.md) | pendiente |
| users | DELETE | `/api/users/:userId/apps/:appId` | Bearer + scope | Quita acceso del usuario a una app (elimina en `user_apps`). | [backend-db-relacion-usuarios-apps.md](../data/backend-db-relacion-usuarios-apps.md), [USERS_TEST_README.md](USERS_TEST_README.md) | pendiente |
| users | GET | `/api/users/:userId/scopes` | Bearer | Devuelve scopes derivados, directos, revocados y efectivos. | [scopes-vs-roles-2026-05-28.md](../history/scopes-vs-roles-2026-05-28.md), [SCOPE_CONVENTION.md](../authz/SCOPE_CONVENTION.md) | pendiente |
| users | POST | `/api/users/:userId/scopes` | Bearer | Agrega scope directo al usuario (no asigna acceso de app en `user_apps`). | [scopes-vs-roles-2026-05-28.md](../history/scopes-vs-roles-2026-05-28.md), [SCOPE_CONVENTION.md](../authz/SCOPE_CONVENTION.md), [USERS_TEST_README.md](USERS_TEST_README.md) | pendiente |
| users | DELETE | `/api/users/:userId/scopes` | Bearer | Quita scope directo del usuario. | [scopes-vs-roles-2026-05-28.md](../history/scopes-vs-roles-2026-05-28.md), [SCOPE_CONVENTION.md](../authz/SCOPE_CONVENTION.md) | pendiente |
| users | POST | `/api/users/:userId/revoked-scopes` | Bearer | Revoca scope especifico sin cambiar rol. | [scopes-vs-roles-2026-05-28.md](../history/scopes-vs-roles-2026-05-28.md), [SCOPE_CONVENTION.md](../authz/SCOPE_CONVENTION.md) | pendiente |
| users | DELETE | `/api/users/:userId/revoked-scopes` | Bearer | Restaura scope previamente revocado. | [scopes-vs-roles-2026-05-28.md](../history/scopes-vs-roles-2026-05-28.md), [SCOPE_CONVENTION.md](../authz/SCOPE_CONVENTION.md) | pendiente |
| apps | GET | `/api/apps` | Bearer | Lista apps registradas con API keys. | [APIKEYS_ENDPOINTS.md](../auth/APIKEYS_ENDPOINTS.md) | pendiente |
| apps | POST | `/api/apps` | Bearer + admin | Registra una app nueva. | [backend-db-schema-inicial.md](../data/backend-db-schema-inicial.md) | pendiente |
| apps | POST | `/api/apps/:appId/apikeys` | Bearer + admin | Crea API key para app. | [APIKEYS_ENDPOINTS.md](../auth/APIKEYS_ENDPOINTS.md), [auditoria-y-rotacion-apikeys-2026-05-28.md](../history/auditoria-y-rotacion-apikeys-2026-05-28.md) | pendiente |
| apps | POST | `/api/apps/:appId/apikeys/:apiKey/revoke` | Bearer + admin | Revoca API key en app especifica. | [APIKEYS_ENDPOINTS.md](../auth/APIKEYS_ENDPOINTS.md) | pendiente |
| apps | DELETE | `/api/apps/apikeys/:apiKey` | Bearer + admin | Revocacion global de API key. | [APIKEYS_ENDPOINTS.md](../auth/APIKEYS_ENDPOINTS.md) | pendiente |
| audit-logs | GET | `/api/audit-logs` | No (actual) | Devuelve eventos de auditoria en memoria. | [auditoria-y-rotacion-apikeys-2026-05-28.md](../history/auditoria-y-rotacion-apikeys-2026-05-28.md) | pendiente |
| catalog | - | `/api/catalog/*` | - | Actualmente sin endpoints implementados en el backend activo. | [backend/src/routes/catalogRoutes.ts](../../backend/src/routes/catalogRoutes.ts) | pendiente |

---

## Usuarios y datos de prueba rapidos

| Usuario | Password | Rol | appId requerido |
|---|---|---|---|
| jorge | jorge123 | admin | No |
| editor | editor123 | editor | Si (`app1`) |
| user | user123 | user | Si (`app1`) |

| App ID | Nombre |
|---|---|
| app1 | Catalogos |
| app2 | Notificaciones |

---

## Referencias generales

- [START_HERE.md](../navigation/START_HERE.md) — Estado actual, direccion y siguiente inmediato
- [DOCS_MAP.md](../navigation/DOCS_MAP.md) — Navegacion por objetivo para encontrar docs rapido
- [AUTH_AUTHZ_GLOSSARY.md](../navigation/AUTH_AUTHZ_GLOSSARY.md) — Terminologia canonica (AuthN vs AuthZ)
- [AUTHZ_AUTOMATED_TESTS.md](AUTHZ_AUTOMATED_TESTS.md) — Tests automatizados actuales de auth/authz (sin impacto en MySQL)
- [AUTHZ_MODEL_V2.md](../authz/AUTHZ_MODEL_V2.md) — Modelo de autorización actualizado (acceso de app + permisos granulares)
- [authz/00_README.md](../authz/00_README.md) — Version modular y gradual del modelo (identity prerequisite -> app access -> authorization)
- [RUNTIME_STATUS_ENDPOINT.md](../runtime/RUNTIME_STATUS_ENDPOINT.md) — Documentación detallada de `/api/runtime/status`
- [APIKEYS_ENDPOINTS.md](../auth/APIKEYS_ENDPOINTS.md)
- [SCOPE_CONVENTION.md](../authz/SCOPE_CONVENTION.md)
- [authentication-design.md](../auth/authentication-design.md)
- [scopes-vs-roles-2026-05-28.md](../history/scopes-vs-roles-2026-05-28.md)
- [backend-db-schema-inicial.md](../data/backend-db-schema-inicial.md)
- [backend-db-relacion-usuarios-apps.md](../data/backend-db-relacion-usuarios-apps.md)
- [next-steps.md](../navigation/next-steps.md)
