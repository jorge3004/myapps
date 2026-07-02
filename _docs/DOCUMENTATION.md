# Documentación del Sistema myapps
**Última actualización:** 2026-07-02  
**Estado:** active  
**Ámbito:** Arquitectura, implementación y operación del backend TypeScript principal

---

## Tabla de Contenidos
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura General](#arquitectura-general)
3. [Autenticación y Autorización](#autenticación-y-autorización)
4. [Gestión de Usuarios](#gestión-de-usuarios)
5. [Gestión de Aplicaciones](#gestión-de-aplicaciones)
6. [Gestión de Scopes y Permisos](#gestión-de-scopes-y-permisos)
7. [Runtime Dinámico](#runtime-dinámico)
8. [Auditoría](#auditoría)
9. [Testing](#testing)
10. [Tabla Rápida de Endpoints](#tabla-rápida-de-endpoints)
11. [Troubleshooting](#troubleshooting)

---

## Resumen Ejecutivo

### ¿Qué es myapps?
Plataforma modular de gestión de aplicaciones en TypeScript. Permite:
- **Multi-aplicación**: Gestionar múltiples apps independientes desde un backend central
- **Autenticación centralizada**: Un login para todas las apps
- **Autorización granular**: Roles por app + scopes detallados
- **Auditoría**: Registro completo de cambios
- **Runtime dinámico**: Cambiar ambiente/datasource sin reiniciar

### Stack Principal
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** MySQL (con fallback a memoria para testing)
- **Autenticación:** JWT (1 hora de expiración)
- **API Keys:** Para integración app-to-app

### Estructura
```
myapps/
├── backend/               # Core API (TypeScript) ← PRINCIPAL
├── frontend/              # Dashboard (pendiente)
├── apps/catalog/backend/  # Legacy (Node.js) - siendo migrado
└── packages/              # Módulos compartidos (user-mgmt, app-mgmt)
```

---

## Arquitectura General

### Monorepo (Polyrepo Conceptual)
- **Backend central** (`myapps/backend`): Gestión de usuarios, apps, API keys, autorización
- **Aplicaciones** (`myapps/apps/`): Cada app con su frontend + backend local
- **Dashboard** (`myapps/frontend`): UI de administración centralizada
- **Packages** (`myapps/packages/`): Lógica reutilizable (módulos)

### Flujo de Autorización de Tres Capas

```
1. Identity Prerequisite (AuthN)
   ↓
   ¿Credenciales válidas? (usuario + password) O (API key válida)
   ↓
2. App Access Gate
   ↓
   ¿Tiene acceso a esta app específica? (consulta user_apps)
   ↓
3. Resource Authorization (AuthZ)
   ↓
   ¿Qué scopes efectivos tiene? (calcula: role + directos - revocados)
   ↓
   ✅ Acceso permitido | ❌ 403 Forbidden
```

### Concepto Clave: "Entrar ≠ Operar"
- **Entrar a app** = validar en `user_apps` (acceso base)
- **Operar recurso** = validar scopes efectivos (permisos granulares)

Un usuario puede tener acceso a una app pero ser bloqueado de recursos específicos si sus scopes no permiten la acción.

---

## Autenticación y Autorización

### Login de Usuario

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "jorge",
  "password": "jorge123",
  "appId": "app1"  // opcional, default si no se envía
}
```

**Response (200):**
```json
{
  "token": "eyJhbGc..."  // JWT válido por 1 hora
}
```

**JWT Payload (user token):**
```json
{
  "type": "user",
  "userId": "abc123",
  "username": "jorge",
  "appId": "app1",
  "role": "admin",
  "appIds": ["app1", "app2"],
  "rolesPorApp": {"app1": "admin", "app2": "admin"},
  "scopes": ["*"],
  "iat": 1719000000,
  "exp": 1719003600
}
```

### Issuance de Token de App (API Key)

**Endpoint:** `POST /api/auth/token`

**Request (body o header):**
```json
{
  "apiKey": "app1_dev_key_2026"
}
```

O header: `x-api-key: app1_dev_key_2026`

**Response (200):**
```json
{
  "token": "eyJhbGc..."  // JWT tipo app
}
```

**JWT Payload (app token):**
```json
{
  "type": "app",
  "appId": "app1",
  "appName": "Catalogos",
  "scopes": ["app1:read:users", "app1:write:catalogs"],
  "iat": 1719000000,
  "exp": 1719003600
}
```

### Validación de Token en Endpoints Protegidos

**Header requerido:**
```
Authorization: Bearer <token>
```

Middleware `verifyUserToken` extrae y valida el token. Si es inválido/expirado → `401 Unauthorized`.

---

## Gestión de Usuarios

### Listar Usuarios

**Endpoint:** `GET /api/users`  
**Autenticación:** Bearer token (scope: `read:users`)  
**Query params:** `?limit=20&offset=0`

**Response:**
```json
{
  "total": 3,
  "limit": 20,
  "offset": 0,
  "count": 3,
  "users": [
    {
      "id": "1",
      "username": "jorge",
      "email": "jorge",
      "role": "admin",
      "scopes": ["*"],
      "revoked_scopes": []
    }
  ]
}
```

### Crear Usuario

**Endpoint:** `POST /api/users`  
**Autenticación:** Bearer token (scope: `write:users`)

**Request:**
```json
{
  "username": "newuser",
  "email": "new@example.com",
  "password": "securepass123",
  "role": "user",  // opcional
  "appIds": ["app1", "app2"],  // opcional: apps iniciales
  "rolesPorApp": {"app1": "editor", "app2": "user"}  // opcional
}
```

**Response (201):**
```json
{
  "id": "xyz789",
  "username": "newuser",
  "email": "new@example.com",
  "role": "user",
  "scopes": [],
  "revoked_scopes": []
}
```

### Búsqueda Rápida

**Por email:** `GET /api/users/by-email/:email`  
**Por username:** `GET /api/users/by-username/:username`  
**Por ID:** `GET /api/users/:userId`

Todos públicos (sin autenticación requerida).

### Asignar Usuario a App

**Endpoint:** `POST /api/users/:userId/apps`  
**Autenticación:** Bearer token (scope: `write:users`)

**Request:**
```json
{
  "appId": "app1",
  "role": "editor"  // opcional, default: "user"
}
```

**Response:**
```json
{
  "userId": "abc123",
  "appId": "app1",
  "role": "editor",
  "appRoles": [...]
}
```

### Remover Usuario de App

**Endpoint:** `DELETE /api/users/:userId/apps/:appId`  
**Autenticación:** Bearer token (scope: `write:users`)

**Response:**
```json
{
  "userId": "abc123",
  "removedAppId": "app1",
  "appRoles": [...]
}
```

### Obtener Apps del Usuario

**Endpoint:** `GET /api/users/:userId/apps`  
**Autenticación:** No requerida

**Response:**
```json
{
  "apps": [
    {"id": "app1", "name": "Catalogos"},
    {"id": "app2", "name": "Notificaciones"}
  ]
}
```

---

## Gestión de Scopes y Permisos

### Modelo de Roles → Scopes

```
ROLE_SCOPES (definido en backend):
├── admin     → ["*"]
├── editor    → ["read:users", "write:catalogs"]
└── user      → ["read:users", "read:catalogs"]
```

**Cálculo de Scopes Efectivos:**
```
Scopes efectivos = (scopes derivados del role + scopes directos) - scopes revocados
```

### Consultar Scopes de Usuario

**Endpoint:** `GET /api/users/:userId/scopes`  
**Autenticación:** Bearer token (solo el usuario o admin)

**Response:**
```json
{
  "userId": "abc123",
  "scopesDerivados": ["app1:read:users", "app1:write:catalogs"],
  "scopesDirectos": ["app1:delete:catalogs"],
  "scopesRevocados": ["app1:write:catalogs"],
  "scopesEfectivos": ["app1:read:users", "app1:delete:catalogs"]
}
```

### Agregar Scope Directo

**Endpoint:** `POST /api/users/:userId/scopes`  
**Autenticación:** Bearer token

**Request:**
```json
{
  "scope": "app1:delete:catalogs"  // formato: appId:action:resource
}
```

### Remover Scope Directo

**Endpoint:** `DELETE /api/users/:userId/scopes`  
**Autenticación:** Bearer token

**Request:**
```json
{
  "scope": "app1:delete:catalogs"
}
```

### Revocar Scope (Explicit Deny)

**Endpoint:** `POST /api/users/:userId/revoked-scopes`  
**Autenticación:** Bearer token

**Request:**
```json
{
  "scope": "app1:write:catalogs"  // este scope será negado, aunque lo tenga por role
}
```

### Restaurar Scope Revocado

**Endpoint:** `DELETE /api/users/:userId/revoked-scopes`  
**Autenticación:** Bearer token

**Request:**
```json
{
  "scope": "app1:write:catalogs"
}
```

### Convención de Scopes

**Formato:** `<appId>:<action>:<resource>`

**Ejemplos:**
- `app1:read:users` - Leer usuarios en app1
- `app1:write:catalogs` - Escribir catálogos en app1
- `app1:*:*` - Acceso total dentro de app1
- `*:*:*` - Superadmin global

**Wildcards permitidos:** `*` puede reemplazar cualquier parte.

---

## Gestión de Aplicaciones

### Listar Aplicaciones

**Endpoint:** `GET /api/apps`  
**Autenticación:** Bearer token

**Response:**
```json
[
  {
    "id": "app1",
    "name": "Catalogos",
    "description": "Gestion de catalogos",
    "apiKeys": [
      {
        "apiKey": "app1_dev_key_2026",
        "scopes": ["app1:read:users", "app1:write:catalogs"],
        "revoked": false
      }
    ]
  }
]
```

### Crear Aplicación

**Endpoint:** `POST /api/apps`  
**Autenticación:** Bearer token (role: `admin`)

**Request:**
```json
{
  "name": "NewApp",
  "description": "Descripción de la app"
}
```

**Response (201):**
```json
{
  "id": "newapp123",
  "name": "NewApp",
  "description": "Descripción de la app",
  "apiKeys": []
}
```

### Crear API Key para App

**Endpoint:** `POST /api/apps/:appId/apikeys`  
**Autenticación:** Bearer token (role: `admin`, app access)

**Request:**
```json
{
  "scopes": ["app1:read:users", "app1:write:catalogs"]  // opcional, default: ["*"]
}
```

**Response (201):**
```json
{
  "apiKey": "generatedkey123",
  "scopes": ["app1:read:users", "app1:write:catalogs"],
  "revoked": false
}
```

### Revocar API Key (Global)

**Endpoint:** `DELETE /api/apps/apikeys/:apiKey`  
**Autenticación:** Bearer token (role: `admin`)

Revoca la API key en todas las apps donde exista.

### Revocar API Key (Por App)

**Endpoint:** `POST /api/apps/:appId/apikeys/:apiKey/revoke`  
**Autenticación:** Bearer token (role: `admin`, app access)

Revoca la API key solo en la app específica.

---

## Runtime Dinámico

### Cambio Dinámico de Ambiente/Datasource

El backend soporta cambiar ambiente y fuente de datos sin reiniciar. Se configura por request via headers o variables de entorno.

### Headers Opcionales

```
x-runtime-env: dev | prod
x-data-source: mysql | memory
```

### Endpoint de Diagnóstico

**Endpoint:** `GET /api/runtime/status`  
**Autenticación:** No requerida

**Response:**
```json
{
  "status": "ok",
  "current": {
    "requestedEnvironment": "dev",
    "servedEnvironment": "dev",
    "requestedDataSource": "mysql",
    "servedDataSource": "mysql",
    "fallbackApplied": false,
    "mysqlAvailable": true,
    "operation": "read"
  },
  "mysqlHealthCache": {
    "cachedValue": true,
    "timeSinceLastCheck": "1.8s",
    "remaining": "13.2s",
    "ttl": "15.0s",
    "dbLatency": "836ms"
  }
}
```

**Interpretación:**
- Si `servedDataSource ≠ requestedDataSource` → fallback a memoria (solo en lecturas)
- Si `dbLatency > 3000ms` → considerar ajustar `MYSQL_HEALTH_TIMEOUT_MS`

### Variables de Entorno

```
# Runtime
RUNTIME_ENV=dev
ALLOWED_RUNTIME_ENVS=dev,prod

# Datasource
DATA_SOURCE=mysql
ALLOWED_DATA_SOURCES=mysql,memory
FALLBACK_READ_TO_MEMORY=true
MYSQL_HEALTH_TTL_MS=15000
MYSQL_HEALTH_TIMEOUT_MS=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=...
DB_NAME=myapps

# Auth
JWT_SECRET=supersecret  # CAMBIAR EN PRODUCCIÓN
```

---

## Auditoría

### Endpoint de Logs

**Endpoint:** `GET /api/audit-logs`  
**Autenticación:** No requerida (considerar proteger)

**Response:**
```json
[
  {
    "id": "log1",
    "event": "USER_CREATED",
    "userId": "abc123",
    "timestamp": "2026-07-02T10:30:00Z",
    "details": {...}
  }
]
```

### Eventos Registrados

Cambios en:
- Creación/actualización de usuarios
- Asignación/revocación de scopes
- Cambios de roles
- Creación/revocación de API keys

---

## Testing

### Usuarios de Prueba

| Usuario | Password | Rol | Apps |
|---------|----------|-----|------|
| `jorge` | `jorge123` | admin | app1, app2 |
| `editor` | `editor123` | editor | app1 |
| `user` | `user123` | user | app1 |

### Aplicaciones de Prueba

| ID | Nombre | API Key |
|----|--------|---------|
| `app1` | Catalogos | `app1_dev_key_2026` |
| `app2` | Notificaciones | `app2_dev_key_2026` |

### Ejecutar Tests

```bash
cd backend
npm run test              # Suite completa
npm run test:authz       # Solo autorización
```

Los tests son unitarios (no tocan MySQL).

---

## Tabla Rápida de Endpoints

| Método | Endpoint | Auth | Scope | Descripción |
|--------|----------|------|-------|-------------|
| POST | `/api/auth/login` | No | - | Login usuario |
| POST | `/api/auth/token` | No | - | Token de app (API key) |
| GET | `/api/users` | Bearer | read:users | Listar usuarios |
| POST | `/api/users` | Bearer | write:users | Crear usuario |
| GET | `/api/users/by-email/:email` | No | - | Buscar por email |
| GET | `/api/users/by-username/:username` | No | - | Buscar por username |
| GET | `/api/users/:userId` | No | - | Obtener usuario |
| GET | `/api/users/:userId/apps` | No | - | Apps del usuario |
| POST | `/api/users/:userId/apps` | Bearer | write:users | Asignar a app |
| DELETE | `/api/users/:userId/apps/:appId` | Bearer | write:users | Remover de app |
| GET | `/api/users/:userId/scopes` | Bearer | - | Consultar scopes |
| POST | `/api/users/:userId/scopes` | Bearer | - | Agregar scope directo |
| DELETE | `/api/users/:userId/scopes` | Bearer | - | Remover scope directo |
| POST | `/api/users/:userId/revoked-scopes` | Bearer | - | Revocar scope |
| DELETE | `/api/users/:userId/revoked-scopes` | Bearer | - | Restaurar scope |
| GET | `/api/apps` | Bearer | - | Listar apps |
| POST | `/api/apps` | Bearer (admin) | - | Crear app |
| POST | `/api/apps/:appId/apikeys` | Bearer (admin) | - | Crear API key |
| POST | `/api/apps/:appId/apikeys/:apiKey/revoke` | Bearer (admin) | - | Revocar API key (por app) |
| DELETE | `/api/apps/apikeys/:apiKey` | Bearer (admin) | - | Revocar API key (global) |
| GET | `/api/audit-logs` | No | - | Logs de auditoría |
| GET | `/api/health` | No | - | Health check |
| GET | `/api/runtime/status` | No | - | Diagnostico de runtime |

---

## Troubleshooting

### "User does not have access to this app"

**Causa:** El usuario no está asignado a la app en `user_apps`.

**Solución:**
1. Loguear con usuario admin
2. Ejecutar: `POST /api/users/:userId/apps` con `{"appId": "app1", "role": "user"}`
3. Reintentar login con la app específica

### "Insufficient scope"

**Causa:** El usuario tiene acceso a la app, pero no tiene permisos para la acción específica.

**Solución:**
1. Verificar scopes necesarios: `GET /api/users/:userId/scopes`
2. Agregar scope directo: `POST /api/users/:userId/scopes` con formato `app1:action:resource`
3. O cambiar rol en `user_apps` para acceder a más permisos base

### "Invalid API key"

**Causa:** La API key no existe, fue revocada, o el formato es incorrecto.

**Solución:**
1. Verificar que la API key está en la app: `GET /api/apps`
2. Si fue revocada, crear una nueva: `POST /api/apps/:appId/apikeys`
3. Usar header `x-api-key` o campo `apiKey` en body

### MySQL Connection Refused

**Causa:** Backend no puede conectar a MySQL.

**Solución:**
1. Verificar variables de entorno: `.env` tiene valores correctos
2. Verificar que MySQL está corriendo: `mysql -h localhost -u root`
3. Si MySQL está caído en producción, el backend fallback a memoria (solo lecturas)
4. Revisar `/api/runtime/status` para diagnosticar

### Token Expirado

**JWT expira en 1 hora.** Si ves `401 Unauthorized`:
1. Loguear nuevamente: `POST /api/auth/login`
2. Usar nuevo token

---

**Versión del documento:** 2  
**Fecha de creación:** 2026-05-09  
**Última revisión:** 2026-07-02  
**Próxima revisión sugerida:** 2026-08-02
