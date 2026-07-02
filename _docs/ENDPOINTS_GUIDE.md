# Guía de Endpoints
**Última actualización:** 2026-07-02  
**Estado:** active  
**Ámbito:** Referencia completa de endpoints API

---

## Información General

**Servidor activo:** [backend/src/index.ts](../../backend/src/index.ts)  
**Base URL:** `http://localhost:4000/api`  
**Nota:** Todos los endpoints se prefijan con `/api`. En las tablas siguientes se omite por brevedad.

---

## Headers Runtime (Opcionales)

| Header | Valores |
|--------|---------|
| `x-runtime-env` | `dev`, `prod` |
| `x-data-source` | `mysql`, `memory` |

**Headers de respuesta de trazabilidad:**
- `x-runtime-env-requested`, `x-runtime-env-served`
- `x-data-source-requested`, `x-data-source-served`
- `x-data-source-fallback`, `x-data-source-mysql-available`

---

## Tabla de Endpoints por Categoría

### Health & Runtime

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/health` | No | Health check general del servidor |
| GET | `/runtime/status` | No | Diagnostico runtime: datasource, MySQL health, configuración activa |

---

### Autenticación

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/auth/login` | No | Login usuario: retorna JWT |
| POST | `/auth/token` | No | Intercambia API key por token de app |

---

### Gestión de Usuarios

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/users` | Bearer (read:users) | Lista usuarios con paginación (?limit=20&offset=0) |
| POST | `/users` | Bearer (write:users) | Crear usuario nuevo |
| GET | `/users/by-email/:email` | No | Buscar usuario por email |
| GET | `/users/by-username/:username` | No | Buscar usuario por username |
| GET | `/users/:userId` | No | Obtener usuario por ID |
| GET | `/users/:userId/apps` | No | Listar apps a las que tiene acceso |
| POST | `/users/:userId/apps` | Bearer (write:users) | Asignar usuario a app con rol |
| DELETE | `/users/:userId/apps/:appId` | Bearer (write:users) | Remover usuario de app |

---

### Gestión de Scopes

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/users/:userId/scopes` | Bearer | Consultar scopes derivados, directos, revocados y efectivos |
| POST | `/users/:userId/scopes` | Bearer | Agregar scope directo a usuario (formato: `appId:action:resource`) |
| DELETE | `/users/:userId/scopes` | Bearer | Remover scope directo de usuario |
| POST | `/users/:userId/revoked-scopes` | Bearer | Revocar scope específico (explicit deny) |
| DELETE | `/users/:userId/revoked-scopes` | Bearer | Restaurar scope previamente revocado |

---

### Gestión de Aplicaciones

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/apps` | Bearer | Listar todas las aplicaciones |
| POST | `/apps` | Bearer (admin) | Crear aplicación nueva |
| POST | `/apps/:appId/apikeys` | Bearer (admin) | Crear API key para aplicación |
| POST | `/apps/:appId/apikeys/:apiKey/revoke` | Bearer (admin) | Revocar API key en app específica |
| DELETE | `/apps/apikeys/:apiKey` | Bearer (admin) | Revocar API key globalmente (todas las apps) |

---

### Auditoría

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/audit-logs` | No | Obtener eventos de auditoría |

---

### Catálogo

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| - | `/catalog/*` | - | Sin endpoints implementados actualmente en backend activo |

---

## Leyenda de Autenticación

| Valor | Significado |
|-------|------------|
| `No` | Endpoint público, sin autenticación requerida |
| `Bearer` | Requiere token JWT en header `Authorization: Bearer <token>` |
| `Bearer (scope)` | Requiere token Bearer + scope específico |
| `Bearer (admin)` | Requiere token Bearer + rol admin |

---

## Guía Rápida por Caso de Uso

### Crear un usuario e inmediatamente darle acceso a una app

1. **Login como admin:** `POST /auth/login` (usuario: `jorge`, password: `jorge123`)
2. **Crear usuario:** `POST /users` (con email, username, password)
3. **Asignar a app:** `POST /users/:userId/apps` (appId: `app1`, role: `editor`)
4. **Verificar:** `GET /users/:userId/apps`

### Gestionar permisos granulares

1. **Consultar scopes actuales:** `GET /users/:userId/scopes`
2. **Agregar permiso específico:** `POST /users/:userId/scopes` (scope: `app1:write:catalogs`)
3. **Remover permiso:** `DELETE /users/:userId/scopes` (scope: `app1:write:catalogs`)
4. **Revocar sin remover:** `POST /users/:userId/revoked-scopes` (para deny explícito)

### Generar token desde API key

1. **Obtener API key:** `GET /apps` (en la respuesta, buscar `apiKeys`)
2. **Intercambiar:** `POST /auth/token` (apiKey en body o header `x-api-key`)
3. **Usar token:** Incluir en header `Authorization: Bearer <token>`

---

## Diagnóstico del Sistema

Usa `/api/runtime/status` para:
- Verificar qué datasource está activo (MySQL vs Memory)
- Revisar latencia de MySQL
- Validar que los headers de runtime se aplican correctamente

Ejemplo:
```bash
curl -H "x-runtime-env: dev" \
     -H "x-data-source: mysql" \
     http://localhost:4000/api/runtime/status
```




