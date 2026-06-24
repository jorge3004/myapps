# Siguientes pasos recomendados

Nota de navegacion (2026-06-24):
- Estado actual + siguiente inmediato: [START_HERE.md](START_HERE.md)
- Mapa de documentacion por objetivo: [DOCS_MAP.md](DOCS_MAP.md)
- Historial de cambios: [IMPLEMENTATION_TIMELINE.md](IMPLEMENTATION_TIMELINE.md)

Este archivo se mantiene como backlog tecnico y notas de continuidad.

1. **Auditoría de acciones y cambios de permisos**
   - Implementar logs/auditoría para registrar quién, cuándo y qué cambios realiza sobre scopes, roles y usuarios.
   - Guardar información relevante: usuario que realiza la acción, usuario afectado, tipo de cambio, timestamp, valores antes/después.
   - Considerar endpoint para consultar historial de cambios por usuario.

2. **UI de administración (React + TypeScript recomendado)**
   - Crear una aplicación web para administrar apps, usuarios, roles y permisos.
   - Funcionalidades sugeridas:
     - Listar y buscar usuarios
     - Ver y editar roles/scopes de cada usuario
     - Crear, editar y eliminar apps
     - Visualizar historial de auditoría
   - Usar TypeScript en el frontend para mantener la robustez y coherencia de tipos con el backend.
   - Integrar autenticación JWT y protección de rutas en la UI.

> Estos pasos ayudarán a robustecer la seguridad, trazabilidad y facilidad de administración del sistema.

---

## Estado al 2026-06-01 — retomar aquí

### ✅ Completado en esta sesión
- MySQL completamente integrado: users, apps, api_keys, user_apps
- `appController.ts` y `userController.ts` ya no usan `application-management` (in-memory)
- Nuevos archivos: `backend/src/models/app.ts`, `backend/src/services/appService.ts`
- Migrations documentadas con comentarios en `backend/migrations/`
- Seed de dev en `backend/migrations/20260601_seed_dev.sql` (idempotente)
- `_docs/backend-db-schema-inicial.md` reducido a decisiones de diseño (sin SQL duplicado)

### 🔜 Siguiente feature: DataSourceProvider (plug & play)
El objetivo es poder cambiar de `mysql` a `memory` (o cualquier otro backend) con una sola variable de entorno `DATA_SOURCE=mysql|memory`, sin tocar lógica de negocio ni controladores.

**Plan de implementación:**

1. Definir interfaces en `backend/src/repositories/`:
   ```
   IUserRepository.ts   — listUsers, getUserById, createUser, updateUserScopes…
   IAppRepository.ts    — listApps, getAppById, createApp, addApiKey, revokeApiKey…
   ```

2. Crear implementaciones:
   ```
   backend/src/repositories/mysql/MysqlUserRepository.ts   ← mueve lógica de models/user.ts
   backend/src/repositories/mysql/MysqlAppRepository.ts    ← mueve lógica de models/app.ts
   backend/src/repositories/memory/MemoryUserRepository.ts
   backend/src/repositories/memory/MemoryAppRepository.ts
   ```

3. Crear el provider central en `backend/src/repositories/index.ts`:
   ```ts
   const source = process.env.DATA_SOURCE || 'mysql';
   export const userRepo: IUserRepository = source === 'mysql' ? new MysqlUserRepository() : new MemoryUserRepository();
   export const appRepo: IAppRepository  = source === 'mysql' ? new MysqlAppRepository()  : new MemoryAppRepository();
   ```

4. Los servicios (`userService.ts`, `appService.ts`) importan del provider, nunca de la implementación concreta.

5. Agregar `DATA_SOURCE=mysql` al `.env` y documentar en `sample.env`.

> Con esto, cambiar de MySQL a memoria (para tests, demos, o desarrollo offline) es solo cambiar `DATA_SOURCE=memory` — sin modificar nada más.

---

## Runtime dinámico por request (actualizado 2026-06-17)

### Qué problema resuelve
- Permite cambiar ambiente y fuente de datos sin reiniciar backend.
- Hace visible para el usuario qué pidió y qué fuente terminó respondiendo.
- Evita inconsistencias: no se permite fallback automático en escrituras reales.

### Cómo funciona (simple)
1. El frontend envía en cada request:
   - `x-runtime-env` (por ejemplo `dev` o `prod`)
   - `x-data-source` (por ejemplo `mysql` o `memory`)
2. El backend resuelve el contexto runtime por request.
3. Si MySQL está caído:
   - Lecturas: puede caer a `memory` (si la política lo permite).
   - Escrituras: se bloquean con `503` para no perder consistencia.
4. El backend devuelve headers de trazabilidad:
   - `x-runtime-env-requested`, `x-runtime-env-served`
   - `x-data-source-requested`, `x-data-source-served`
   - `x-data-source-fallback`, `x-data-source-mysql-available`

### Variables de entorno importantes
- `RUNTIME_ENV=dev`
- `ALLOWED_RUNTIME_ENVS=dev,prod`
- `ALLOWED_DATA_SOURCES=mysql,memory`
- `FALLBACK_READ_TO_MEMORY=true`
- `READ_SEMANTIC_POST_ROUTES=/api/auth/login,/api/auth/token`
- `MYSQL_HEALTH_TTL_MS=5000`
- `MYSQL_HEALTH_TIMEOUT_MS=350`

### ¿Qué significa “semántico” aquí?

Semántico = según el significado real de la operación, no solo por el verbo HTTP.

Ejemplo rápido:
- `POST /api/auth/login` usa POST, pero su significado real es validar credenciales y emitir token.
- Eso no modifica registros de negocio (usuarios/apps), por eso se trata como lectura semántica.

En cambio:
- `POST /api/users`
- `PATCH /api/users/:id`
- `POST /api/apps/:id/api-keys`

Sí cambian estado persistente, por tanto son escrituras semánticas y nunca deben hacer fallback automático a memoria.

### Buenas prácticas aplicadas
- Request-scoped runtime context (no global estático).
- Fallback solo en lecturas.
- Bloqueo explícito de escrituras cuando el primario no está disponible.
- Política configurable por `.env` (sin cambiar código para ajustes operativos).
- Endpoint de observabilidad: `/api/runtime/status`.

---

## Gobernanza de documentación (para evitar desalineaciones)

### 1. Fuente de historial única
- Mantener una línea de tiempo central en [IMPLEMENTATION_TIMELINE.md](IMPLEMENTATION_TIMELINE.md).
- Toda decisión importante o cambio de arquitectura debe registrarse ahí con fecha y estado.

### 2. Estado explícito por documento
Al inicio de cada documento técnico, incluir:
- `Última actualización: YYYY-MM-DD`
- `Estado: active | superseded | deprecated`
- `Ámbito: actual | histórico`

### 3. Regla de modificación
- Si un documento cambia de propósito (por ejemplo, de actual a histórico), no se borra contexto:
   - Se marca como `superseded`.
   - Se agrega enlace al documento que lo reemplaza.

### 4. Regla para nuevos documentos
- Antes de crear un doc nuevo, verificar si ya existe uno equivalente en `_docs`.
- Si existe, actualizarlo.
- Si no existe, crearlo con metadata de estado/fecha.

### 5. Prioridad de lectura
Cuando haya conflicto entre documentos:
1. Endpoint guide actual: [ENDPOINTS_GUIDE.md](../testing/ENDPOINTS_GUIDE.md)
2. Timeline de cambios: [IMPLEMENTATION_TIMELINE.md](IMPLEMENTATION_TIMELINE.md)
3. Documentos históricos fechados (arquitectura inicial, avances antiguos, etc.)
