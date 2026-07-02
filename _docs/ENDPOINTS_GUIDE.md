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

## Vista rapida por categoria  (/api...)

### health/runtime
- GET /health
- GET /runtime/status

### auth
- POST /auth/login
- POST /auth/token

### users
- GET /users
- POST /users
- GET  /users/by-email/:email
- GET /users/by-username/:username
- GET /users/:userId
- GET /users/:userId/apps
- POST /users/:userId/apps
- DELETE /users/:userId/apps/:appId
- GET /users/:userId/scopes
- POST /users/:userId/scopes
- DELETE /users/:userId/scopes
- POST /users/:userId/revoked-scopes
- DELETE /users/:userId/revoked-scopes

### apps
- GET /apps
- POST /apps
- POST /apps/:appId/apikeys
- POST /apps/:appId/apikeys/:apiKey/revoke
- DELETE /apps/apikeys/:apiKey

### audit-logs
- GET /audit-logs

### catalog
- /catalog/* (sin endpoints implementados actualmente)


| Grupo | Metodo | Endpoint | Auth | Descripcion breve | Contexto | Estado prueba |
|---|---|---|---|---|---|---|
| health/runtime | GET | `/health` | No | Health check general del servidor. | - | ok |
| health/runtime | GET | `/api/health/data-source` | No | ~~Eliminado — contenido absorbido por `/api/runtime/status`~~ | - | - |
| health/runtime | GET | `/api/runtime/status` | No | Estado runtime completo: contexto dinámico, política, decisiones y health check MySQL. | [RUNTIME_STATUS_ENDPOINT.md](../runtime/RUNTIME_STATUS_ENDPOINT.md), [next-steps.md](../navigation/next-steps.md) | ok |
| auth | POST | `/api/auth/login` | No | Login de usuario, emite JWT. | [authentication-design.md](../auth/authentication-design.md) | pendiente |
| auth | POST | `/api/auth/token` | No | Intercambia API key por token tipo app. | [authentication-design.md](../auth/authentication-design.md), [APIKEYS_ENDPOINTS.md](../auth/APIKEYS_ENDPOINTS.md) | pendiente |
| users | GET | `/users` | Bearer + scope | Lista usuarios (paginado). | [SCOPE_CONVENTION.md](../authz/SCOPE_CONVENTION.md) | pendiente |
| users | POST | `/api/users` | Bearer + scope | Crea usuario y opcionalmente asigna apps/roles por app. | [backend-db-relacion-usuarios-apps.md](../data/backend-db-relacion-usuarios-apps.md) | pendiente |
| users | GET | `/users/by-email/:email` | No (actual) | Busca usuario por email. | - | pendiente |
| users | GET | `/users/by-username/:username` | No (actual) | Busca usuario por username (pendiente validar handler real). | [backend/src/routes/userRoutes.ts](../../backend/src/routes/userRoutes.ts#L27) | pendiente |
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




