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
9. [Datos Iniciales (Seed)](#datos-iniciales-seed)
    - [Usuarios Iniciales](#usuarios-iniciales)
    - [Aplicaciones Iniciales](#aplicaciones-iniciales)
    - [Inicialización SQL (MySQL)](#inicialización-sql-mysql)
    - [Verificación de Migraciones](#verificación-de-migraciones)
    - [Verificación de Seed](#verificación-de-seed)
10. [Testing (Pruebas Unitarias)](#testing-pruebas-unitarias)
11. [Gestión de Variables de Entorno y Secretos](#gestión-de-variables-de-entorno-y-secretos)
12. [Tabla Rápida de Endpoints](#tabla-rápida-de-endpoints)
13. [Troubleshooting](#troubleshooting)

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

## Datos Iniciales (Seed)

### Navegación Rápida de Seed

- [Usuarios Iniciales](#usuarios-iniciales)
- [Aplicaciones Iniciales](#aplicaciones-iniciales)
- [Inicialización SQL (MySQL)](#inicialización-sql-mysql)
- [Convención de Fuente Canónica](#convención-de-fuente-canónica)
- [Checklist Manual (Aprendiz)](#checklist-manual-aprendiz)
- [Acceso a MySQL por Consola](#acceso-a-mysql-por-consola)
- [Verificación de Migraciones](#verificación-de-migraciones)
- [Ejecución desde DBeaver](#ejecución-desde-dbeaver)
- [Transacción durante Seed](#transacción-durante-seed)
- [Verificación de Seed](#verificación-de-seed)
- [ON DUPLICATE KEY UPDATE en este proyecto](#on-duplicate-key-update-en-este-proyecto)

### Usuarios Iniciales

| ID | Usuario | Password | Rol | Apps |
|----|---------|----------|-----|------|
| `f1a2b3c4d5e6f701` | `jorge` | `jorge123` | admin | app1, app2 |
| `f1a2b3c4d5e6f702` | `editor` | `editor123` | editor | app1 |
| `f1a2b3c4d5e6f703` | `user` | `user123` | user | app1 |

Fuente oficial (SQL): [backend/migrations/20260601_seed_dev.sql](../backend/migrations/20260601_seed_dev.sql)  
Fuente oficial (memoria): [backend/src/seeds/devBootstrap.ts](../backend/src/seeds/devBootstrap.ts)

### Aplicaciones Iniciales

| ID | Nombre | API Key |
|----|--------|---------|
| `app1` | Catalogos | `app1_dev_key_2026` |
| `app2` | Notificaciones | `app2_dev_key_2026` |

### Inicialización SQL (MySQL)

Concepto rápido:
- **Migrations (DDL):** crean o ajustan estructura (tablas, columnas, tipos, índices, FK).
- **Seed (DML):** inserta/actualiza datos iniciales en tablas ya existentes.

En este proyecto, el bootstrap completo de una base vacía es:
1. Ejecutar migrations (estructura)
2. Ejecutar seed (datos mínimos)

Si estás aprendiendo, conviene hacerlo de forma manual y en pasos cortos:
1. Entrar a MySQL desde la consola o DBeaver.
2. Verificar la estructura actual con `SHOW CREATE TABLE`.
3. Ejecutar una migration por vez.
4. Volver a verificar la estructura.
5. Ejecutar el seed por bloques o archivo completo.
6. Verificar que los datos iniciales quedaron bien.

Archivos canónicos (sin duplicar SQL en esta documentación):
1. [backend/migrations/20260529_create_users_table.sql](../backend/migrations/20260529_create_users_table.sql)
2. [backend/migrations/20260529_create_user_apps_table.sql](../backend/migrations/20260529_create_user_apps_table.sql)
3. [backend/migrations/20260601_create_apps_api_keys.sql](../backend/migrations/20260601_create_apps_api_keys.sql)
4. [backend/migrations/20260601_seed_dev.sql](../backend/migrations/20260601_seed_dev.sql)

### Convención de Fuente Canónica

Definición simple:
- Una fuente canónica es el archivo oficial de verdad para un tema.

Reglas del equipo:
1. Si hay conflicto entre documentación y SQL, prevalece el SQL canónico.
2. La documentación explica, resume y enlaza; no duplica bloques SQL largos.
3. Cualquier cambio funcional debe actualizar primero el archivo canónico.
4. Después, se ajusta la documentación para reflejar ese cambio.
5. Evitar mantener la misma lógica en dos lugares con contenido distinto.

### Checklist Manual (Aprendiz)

Flujo recomendado, en orden:
1. Validar cliente MySQL en WSL (`mysql --version`).
2. Cargar variables del `.env` en tu shell (`set -a`, `source .env`, `set +a`).
3. Entrar a MySQL y validar sesión (`SELECT USER(), DATABASE();`).
4. Verificar estructura actual con `SHOW CREATE TABLE ...`.
5. Ejecutar migrations (una por una).
6. Verificar estructura otra vez.
7. Ejecutar seed.
8. Verificar datos iniciales con `SELECT`.

### Acceso a MySQL por Consola

Si ya instalaste MySQL localmente en WSL, primero valida que el cliente esté disponible:

```bash
mysql --version
```

Si eso responde correctamente, entonces puedes entrar directo con:

```bash
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" "$DB_NAME"
```

Si prefieres que MySQL pida la contraseña de forma interactiva, usa:

```bash
mysql -u "$DB_USER" -p -h "$DB_HOST" "$DB_NAME"
```

Ejemplo simple, usando los valores del entorno de desarrollo:

```bash
mysql -u root -p -h 127.0.0.1 myapps_dev
```

Si usas `-p"$DB_PASSWORD"`, la contraseña queda tomada desde variable de entorno y no se te pregunta en pantalla.

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

Importante: tener el archivo [backend/.env](../backend/.env) no significa que tu shell ya conozca esas variables. Para comandos de consola, primero debes cargarlas en la sesión actual.

Ejemplo manual en WSL:

```bash
cd /home/jorge/myapps/backend
set -a
source .env
set +a
echo "$DB_USER"
echo "$DB_HOST"
```

Después de eso, `mysql -u "$DB_USER" ...` sí puede usar esos valores.

Si quieres verificar que el backend también las lea bien, corre:

```bash
cd /home/jorge/myapps/backend
npm run check-env
```

Ese comando compara tu `.env` local contra `sample.env` y te ayuda a detectar claves faltantes.

### Verificación de Migraciones

Antes de seed, verifica que la estructura exista y sea compatible:

`SHOW CREATE TABLE` no “crea” la tabla. Lo que hace es mostrar el SQL exacto que MySQL usaría para recrearla con la estructura actual: columnas, tipos, claves, índices y opciones.

Eso sirve para comparar lo que esperas contra lo que realmente existe.

```sql
SHOW CREATE TABLE users;
SHOW CREATE TABLE apps;
SHOW CREATE TABLE user_apps;
SHOW CREATE TABLE api_keys;
```

Si una tabla existe pero no tiene columnas/tipos esperados, no basta con el seed: debes aplicar una migración de ajuste (`ALTER TABLE ...`).

Para practicar, puedes probar un cambio controlado y luego revertirlo:
1. Quitar temporalmente una columna poco crítica.
2. Correr `SHOW CREATE TABLE ...` y confirmar que el esquema ya no coincide.
3. Restaurar la columna.
4. Volver a correr la verificación y confirmar que ahora sí coincide.

### Ejecución desde DBeaver

Cuando la verificación ya esté bien, puedes ejecutar las migraciones y el seed desde el SQL Editor, en este orden:

1. `20260529_create_users_table.sql`
2. `20260529_create_user_apps_table.sql`
3. `20260601_create_apps_api_keys.sql`
4. `20260601_seed_dev.sql`

También puedes ejecutar desde terminal:

```bash
cd backend
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/20260529_create_users_table.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/20260529_create_user_apps_table.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/20260601_create_apps_api_keys.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/20260601_seed_dev.sql
```

### Transacción durante Seed

Esta parte aplica específicamente cuando ejecutas el seed SQL.

No es obligatoria si ejecutas archivo por archivo (MySQL suele trabajar con autocommit), pero **sí es recomendada** para el seed cuando quieres atomicidad.

- Con transacción: `START TRANSACTION; ... COMMIT;`
- Si algo no te convence en validación: `ROLLBACK;`

Para práctica y seguridad:

```sql
START TRANSACTION;
-- Ejecuta aquí el contenido de backend/migrations/20260601_seed_dev.sql
-- Verifica con SELECTs
COMMIT;
-- Si hay dudas: ROLLBACK;
```

### Verificación de Seed

Después de ejecutar seed:

```sql
SELECT id, username, email, role FROM users ORDER BY id;
SELECT id, name FROM apps ORDER BY id;
SELECT user_id, app_id, role FROM user_apps ORDER BY user_id, app_id;
SELECT id, app_id, api_key FROM api_keys ORDER BY id;
```

### ON DUPLICATE KEY UPDATE en este proyecto

En este proyecto, `ON DUPLICATE KEY UPDATE` está en el seed canónico [backend/migrations/20260601_seed_dev.sql](../backend/migrations/20260601_seed_dev.sql), en los 4 bloques `INSERT` de:

1. `apps`
2. `users`
3. `user_apps`
4. `api_keys`

¿Qué logra?

- Mantener idempotencia del seed a nivel de filas.

- Si ya existe una fila por PK/UNIQUE, actualiza columnas definidas.
- Si no existe, inserta.
- **No** corrige estructura de tabla (columnas/tipos/FKs).
- **No** actúa si no hay conflicto de clave única o primaria.

### Recomendación de estudio

Sí, por ahora conviene dejar estos pasos explicados de forma sencilla en la documentación.

- Te ayuda a practicar comandos MySQL de forma manual.
- Te deja un procedimiento repetible para revisar migraciones y seed.
- Más adelante, cuando ya lo domines, se puede compactar o mover a una guía más breve.

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
