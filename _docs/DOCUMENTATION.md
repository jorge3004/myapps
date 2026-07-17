# Documentación del Sistema myapps
**Última actualización:** 2026-07-17  
**Estado:** active  
**Ámbito:** Arquitectura, implementación y operación del backend TypeScript principal

---

## Tabla de Contenidos
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Guía Cronológica Global](#guía-cronológica-global)
3. [Arquitectura General](#arquitectura-general)
4. [Autenticación y Autorización](#autenticación-y-autorización)
    - [Orden recomendado de pruebas (Auth)](#orden-recomendado-de-pruebas-auth)
5. [Gestión de Usuarios](#gestión-de-usuarios)
    - [Orden recomendado de pruebas (Usuarios)](#orden-recomendado-de-pruebas-usuarios)
6. [Gestión de Aplicaciones](#gestión-de-aplicaciones)
    - [Orden recomendado de pruebas (Apps)](#orden-recomendado-de-pruebas-apps)
7. [Gestión de Scopes y Permisos](#gestión-de-scopes-y-permisos)
   - [Orden recomendado de pruebas (Scopes)](#orden-recomendado-de-pruebas-scopes)
8. [Runtime Dinámico](#runtime-dinámico)
9. [Auditoría](#auditoría)
10. [Datos Iniciales (Seed/Migrations)](#datos-iniciales-seedmigrations)
    - [Usuarios Iniciales](#usuarios-iniciales)
    - [Aplicaciones Iniciales](#aplicaciones-iniciales)
    - [Inicialización SQL (MySQL)](#inicialización-sql-mysql)
    - [Framework de Trabajo (WSL)](#framework-de-trabajo-wsl)
    - [Variables de Entorno Permanentes (WSL)](#variables-de-entorno-permanentes-wsl)
    - [Verificación de Login Exitoso](#verificación-de-login-exitoso)
    - [Bootstrap Mixto (Recomendado)](#bootstrap-mixto-recomendado)
    - [Notas y Archivo Histórico](#notas-y-archivo-histórico)
11. [Testing (Pruebas Unitarias)](#testing-pruebas-unitarias)
12. [Gestión de Variables de Entorno y Secretos](#gestión-de-variables-de-entorno-y-secretos)
13. [Tabla Rápida de Endpoints](#tabla-rápida-de-endpoints)
14. [Troubleshooting](#troubleshooting)

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

## Guía Cronológica Global

Orden recomendado para leer/ejecutar sin perderte:

1. Preparar entorno y base en [Datos Iniciales (Seed/Migrations)](#datos-iniciales-seedmigrations).
2. Ejecutar bootstrap en [Bootstrap Mixto (Recomendado)](#bootstrap-mixto-recomendado).
3. Validar acceso en [Autenticación y Autorización](#autenticación-y-autorización).
4. Probar operaciones en [Gestión de Usuarios](#gestión-de-usuarios), [Gestión de Aplicaciones](#gestión-de-aplicaciones) y [Gestión de Scopes y Permisos](#gestión-de-scopes-y-permisos).
5. Revisar observabilidad en [Runtime Dinámico](#runtime-dinámico) y [Auditoría](#auditoría).
6. Cerrar con [Testing (Pruebas Unitarias)](#testing-pruebas-unitarias).

Si solo quieres arrancar rápido en desarrollo, empieza en [Framework de Trabajo (WSL)](#framework-de-trabajo-wsl).

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

### Orden recomendado de pruebas (Auth)

1. Probar `POST /api/auth/login` con usuario de seed y validar que devuelve JWT.
2. Probar `POST /api/auth/token` con `apiKey` y validar JWT tipo app.
3. Usar ese token en un endpoint protegido para confirmar `Authorization: Bearer ...`.
4. Probar caso inválido/expirado y confirmar `401 Unauthorized`.

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

### Orden recomendado de pruebas (Usuarios)

1. `GET /api/users` para validar listado base y paginación.
2. `POST /api/users` para crear usuario nuevo.
3. `GET /api/users/by-email/:email` o `GET /api/users/:userId` para confirmar creación.
4. `POST /api/users/:userId/apps` para asignar app/rol y luego `GET /api/users/:userId/apps`.
5. `DELETE /api/users/:userId/apps/:appId` para validar remoción.

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

### Orden recomendado de pruebas (Scopes)

1. `GET /api/users/:userId/scopes` para establecer baseline.
2. `POST /api/users/:userId/scopes` para agregar scope directo.
3. `POST /api/users/:userId/revoked-scopes` para revocar scope efectivo.
4. `DELETE /api/users/:userId/revoked-scopes` y `DELETE /api/users/:userId/scopes` para rollback funcional.
5. Repetir `GET /api/users/:userId/scopes` y validar cálculo de scopes efectivos.

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

### Orden recomendado de pruebas (Apps)

1. `GET /api/apps` para validar estado inicial.
2. `POST /api/apps` para crear app nueva.
3. `POST /api/apps/:appId/apikeys` para generar key y scopes.
4. Probar revocación por app y global para confirmar ciclo de vida de API keys.

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
    "operation": "read",
    "reason": null
  },
  "runtimeContext": {
    "dynamic": true,
    "note": null
  },
  "defaults": {
    "environment": "dev",
    "dataSource": "mysql"
  },
  "available": {
    "environments": ["dev", "prod"],
    "dataSources": ["mysql", "memory"]
  },
  "policy": {
    "fallbackReadToMemory": true,
    "readSemanticPostRoutes": ["/api/auth/login", "/api/auth/token"]
  },
  "mysqlHealthCache": {
    "cachedValue": true,
    "timeSinceLastCheck": "2.1s",
    "remaining": "8.9s",
    "ttl": "11.0s",
    "timeout": "3.6s",
    "dbLatency": "1.2s",
    "lastCheckTimedOut": false
  }
}
```

**Interpretación:**
- Si `servedDataSource ≠ requestedDataSource` → fallback a memoria (solo en lecturas)
- Si `runtimeContext.dynamic = false`, el middleware de runtime no está activo para esa petición y `mysqlAvailable` se obtiene por demanda
- `reason` aclara por qué se tomó la decisión de runtime; `null` significa que no hubo una razón especial
- Si `dbLatency` se acerca o supera `MYSQL_HEALTH_TIMEOUT_MS`, conviene revisar el estado de MySQL o subir el timeout
- Los defaults actuales en `config.ts` son `MYSQL_HEALTH_TTL_MS=10000` y `MYSQL_HEALTH_TIMEOUT_MS=3500`; si ves otros valores en la respuesta, vienen de tu `.env`

### Variables de Entorno

```
# Runtime
RUNTIME_ENV=dev
ALLOWED_RUNTIME_ENVS=dev,prod

# Datasource
DATA_SOURCE=mysql
ALLOWED_DATA_SOURCES=mysql,memory
FALLBACK_READ_TO_MEMORY=true
MYSQL_HEALTH_TTL_MS=11000
MYSQL_HEALTH_TIMEOUT_MS=3600

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

## Datos Iniciales (Seed/Migrations)

### Navegación Rápida de Seed/Migrations

- [Usuarios Iniciales](#usuarios-iniciales)
- [Aplicaciones Iniciales](#aplicaciones-iniciales)
- [Inicialización SQL (MySQL)](#inicialización-sql-mysql)
- [Framework de Trabajo (WSL)](#framework-de-trabajo-wsl)
- [Variables de Entorno Permanentes (WSL)](#variables-de-entorno-permanentes-wsl)
- [Verificación de Login Exitoso](#verificación-de-login-exitoso)
- [Bootstrap Mixto (Recomendado)](#bootstrap-mixto-recomendado)
- [Notas y Archivo Histórico](#notas-y-archivo-histórico)

### Usuarios Iniciales

| ID | Usuario | Password | Rol | Apps |
|----|---------|----------|-----|------|
| `f1a2b3c4d5e6f701` | `jorge` | `jorge123` | admin | app1, app2 |
| `f1a2b3c4d5e6f702` | `editor` | `editor123` | editor | app1 |
| `f1a2b3c4d5e6f703` | `user` | `user123` | user | app1 |

Fuente oficial (SQL): [backend/migrations/20260716_bootstrap_dev_mixed.sql](../backend/migrations/20260716_bootstrap_dev_mixed.sql)  
Fuente oficial (memoria): [backend/src/seeds/devBootstrap.ts](../backend/src/seeds/devBootstrap.ts)

### Aplicaciones Iniciales

| ID | Nombre | API Key |
|----|--------|---------|
| `app1` | Catalogos | `app1_dev_key_2026` |
| `app2` | Notificaciones | `app2_dev_key_2026` |

### Inicialización SQL (MySQL)

Concepto rápido:
1. **Schema migration (DDL):** estructura.
2. **Seed / data migration (DML):** datos.
3. **Migración mixta (DDL + DML):** ambas en un solo archivo.

Ruta recomendada para este proyecto en etapa actual:
1. usar bootstrap mixto para reset rapido de desarrollo.
2. conservar ruta separada solo como referencia/debugging fino (archivada).

Archivo principal activo:
- [backend/migrations/20260716_bootstrap_dev_mixed.sql](../backend/migrations/20260716_bootstrap_dev_mixed.sql)

Estado actual de carpeta activa:
- `backend/migrations/` contiene solo ese archivo como entrypoint de bootstrap.

Ruta separada archivada:
- [backend/migrations_archive/split/](../backend/migrations_archive/split/)

### Framework de Trabajo (WSL)

Flujo recomendado (cronológico):
1. Confirmar cliente MySQL instalado en WSL.
2. Cargar variables de entorno en la shell (idealmente permanentes via `~/.bashrc`).
3. Entrar por terminal `mysql`.
4. Verificar sesión/base activa.
5. Ejecutar bootstrap mixto.
6. Verificar estructura y datos.

Si prefieres DBeaver de forma opcional, ten a mano:
- host
- database
- user
- password

Comprobación de instalación en WSL:

```bash
mysql --version
```

Si falta el cliente en WSL (Ubuntu):

```bash
sudo apt install mysql-client-core
mysql --version
```

### Variables de Entorno Permanentes (WSL)

Objetivo: dejar las variables disponibles en cada terminal nueva.

```bash
grep -q 'MYAPPS_BACKEND_ENV="/home/jorge/myapps/backend/.env"' ~/.bashrc || cat >> ~/.bashrc <<'EOF'
# myapps backend env autoload (WSL interactive shells)
export MYAPPS_BACKEND_ENV="/home/jorge/myapps/backend/.env"
if [ -f "$MYAPPS_BACKEND_ENV" ]; then
  set -a
  source "$MYAPPS_BACKEND_ENV"
  set +a
fi
EOF
source ~/.bashrc
```

Login por consola (ya con variables cargadas):

```bash
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" "$DB_NAME"
```

### Verificación de Login Exitoso

Si el login fue correcto, deberías ver un prompt como:

```text
mysql>
```

Dentro de MySQL, puedes validar sesión y base activa con:

```sql
SELECT USER(), DATABASE();
```

Y salir con:

```sql
exit;
```

Tip rápido para evitar confusiones:
- Si ves `mysql>`, estás dentro del cliente MySQL y puedes ejecutar `SELECT`, `SHOW`, `ALTER`, etc.
- Si ves un prompt de shell (por ejemplo `jorge@equipo:~$`), estás en bash; ahí debes usar el comando `mysql ...` para entrar o ejecutar con `-e`.

Consultas utiles de verificacion rapida:

```sql
SHOW CREATE TABLE users;
SELECT COUNT(*) AS total, SUM(revoked_scopes IS NULL) AS nulls FROM users;
SELECT id, username, email, role FROM users ORDER BY id;
SELECT id, name FROM apps ORDER BY id;
```

### Bootstrap Mixto (Recomendado)

Script principal:
- [backend/migrations/20260716_bootstrap_dev_mixed.sql](../backend/migrations/20260716_bootstrap_dev_mixed.sql)

Ejecucion desde terminal:

```bash
cd backend
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/20260716_bootstrap_dev_mixed.sql
```

Ejecucion desde cliente `mysql`:

```sql
SOURCE /home/jorge/myapps/backend/migrations/20260716_bootstrap_dev_mixed.sql;
```

IMPORTANTE:
- Este script hace `DROP TABLE` de las tablas del backend.
- Al ejecutarlo, se elimina la data previa de esas tablas.
- Usar solo en entorno de desarrollo.

### Notas y Archivo Histórico

Documentacion teorica resumida:
- [_docs/notas/notas_sql.md](notas/notas_sql.md)

Archivos SQL separados archivados (referencia/debug fino):
- [backend/migrations_archive/split/](../backend/migrations_archive/split/)

Ejemplo archivado de seed con decision manual de transaccion (`COMMIT/ROLLBACK` en consola):
- [backend/migrations_archive/test/007_seed_dev_manual_decision.sql](../backend/migrations_archive/test/007_seed_dev_manual_decision.sql)
- [backend/migrations_archive/test/README.md](../backend/migrations_archive/test/README.md)

## Testing (Pruebas Unitarias)

### Ejecutar Tests

```bash
cd backend
npm run test              # Suite completa
npm run test:authz       # Solo autorización
```

Los tests son unitarios (no tocan MySQL).

---

## Gestión de Variables de Entorno y Secretos

### Ubicación del archivo local
- El backend principal carga variables desde `myapps/backend/.env`.
- Ese archivo está ignorado por git desde el `.gitignore` raíz, por lo que no debe commitearse.

### Qué sí va al repositorio
- `backend/sample.env` debe contener todas las claves requeridas, pero solo con valores de ejemplo o placeholders.
- `npm run check-env` dentro de `backend/` permite verificar que tu `.env` local no tenga claves faltantes respecto a `sample.env`.

### Qué no va al repositorio
- No guardar credenciales reales en `README`, `_docs/`, commits, issues ni pull requests.
- Aunque hoy sean credenciales de prueba, tratarlas como secret evita que más adelante se reutilicen o queden expuestas por costumbre.

### Dónde guardar las credenciales reales
- Usar un password manager compartido del equipo, un vault, o al menos una nota segura fuera de GitHub.
- Si el equipo no tiene gestor de secretos todavía, un paso mínimo aceptable es mantener un documento privado fuera del repo con el valor actual de cada secreto y quién lo administra.

### Flujo recomendado al clonar en otra laptop
1. Copiar `backend/sample.env` a `backend/.env`.
2. Completar los valores reales desde la fuente segura del equipo.
3. Ejecutar `npm run check-env` en `backend/`.
4. Levantar el backend con `npm run dev`.

---

## Tabla Rápida de Endpoints

> **Nota:** Esta es una referencia visual rápida. Para la lista **completa y detallada** de los 24 endpoints organizados por categoría, ver [ENDPOINTS_GUIDE.md](ENDPOINTS_GUIDE.md).

### Health & Runtime
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| GET | `/runtime/status` | No | Diagnostico runtime |

### Autenticación
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Login usuario → JWT |
| POST | `/auth/token` | No | API key → token app |

### Usuarios
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/users` | Bearer | Listar usuarios |
| POST | `/users` | Bearer | Crear usuario |
| GET | `/users/by-email/:email` | No | Buscar por email |
| GET | `/users/:userId` | No | Obtener por ID |
| GET | `/users/:userId/apps` | No | Ver apps accesibles |
| POST | `/users/:userId/apps` | Bearer | Asignar a app |
| DELETE | `/users/:userId/apps/:appId` | Bearer | Remover de app |

### Scopes & Permisos
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/users/:userId/scopes` | Bearer | Consultar scopes |
| POST | `/users/:userId/scopes` | Bearer | Agregar scope |
| DELETE | `/users/:userId/scopes` | Bearer | Remover scope |
| POST | `/users/:userId/revoked-scopes` | Bearer | Revocar scope |
| DELETE | `/users/:userId/revoked-scopes` | Bearer | Restaurar scope |

### Aplicaciones
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/apps` | Bearer | Listar apps |
| POST | `/apps` | Bearer (admin) | Crear app |
| POST | `/apps/:appId/apikeys` | Bearer (admin) | Crear API key |
| DELETE | `/apps/apikeys/:apiKey` | Bearer (admin) | Revocar API key |

### Auditoría
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/audit-logs` | No | Ver logs |

**→ [Ver lista completa y detallada en ENDPOINTS_GUIDE.md](ENDPOINTS_GUIDE.md)**

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
