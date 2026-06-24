# Timeline de Implementacion
Ultima actualizacion: 2026-06-23

## Objetivo
Este archivo es la fuente central de historial tecnico para saber que cambio, cuando cambio y cual es el estado actual.

## Convenciones
- Estado de entrada:
  - active: vigente en el sistema actual
  - superseded: reemplazado por una implementacion mas nueva
  - deprecated: legado, no recomendado para uso actual
- Cada hito debe incluir:
  - fecha
  - resumen corto
  - impacto
  - referencias a archivos o docs

---

## Hitos

### 2026-05-09
- Estado: superseded (parcial)
- Resumen: se definio la arquitectura inicial de monorepo con core backend/frontend y apps por dominio.
- Impacto: establecio base conceptual del proyecto.
- Referencias:
  - [architecture-map-2026-05-09.md](../history/architecture-map-2026-05-09.md)

### 2026-05-11
- Estado: superseded
- Resumen: se propuso modularizacion via packages (user-management, app-management).
- Impacto: vision de reutilizacion, luego evolucionada a implementacion local en backend TypeScript.
- Referencias:
  - [modularizacion.md](../history/modularizacion.md)

### 2026-05-27
- Estado: superseded (parcial)
- Resumen: estabilizacion inicial de endpoints y debugging de imports/workspaces.
- Impacto: base funcional para migracion posterior a MySQL y runtime dinamico.
- Referencias:
  - [avance-backend-2026-05-27.md](../history/avance-backend-2026-05-27.md)

### 2026-05-28
- Estado: active
- Resumen: definicion de revocacion global/especifica de API keys y convenciones de scopes/roles.
- Impacto: seguridad y trazabilidad de permisos.
- Referencias:
  - [APIKEYS_ENDPOINTS.md](../auth/APIKEYS_ENDPOINTS.md)
  - [SCOPE_CONVENTION.md](../auth/SCOPE_CONVENTION.md)
  - [scopes-vs-roles-2026-05-28.md](../history/scopes-vs-roles-2026-05-28.md)
  - [auditoria-y-rotacion-apikeys-2026-05-28.md](../history/auditoria-y-rotacion-apikeys-2026-05-28.md)

### 2026-06-01
- Estado: active
- Resumen: migracion fuerte a MySQL (users, apps, api_keys, user_apps), seed/migrations consolidadas.
- Impacto: persistencia real y abandono del in-memory como fuente principal.
- Referencias:
  - [backend-db-schema-inicial.md](../data/backend-db-schema-inicial.md)
  - [backend-db-relacion-usuarios-apps.md](../data/backend-db-relacion-usuarios-apps.md)
  - [backend-db-connection-flow.md](../data/backend-db-connection-flow.md)
  - [next-steps.md](next-steps.md)

### 2026-06-17
- Estado: active
- Resumen: runtime dinamico por request (x-runtime-env, x-data-source), fallback controlado y observabilidad.
- Impacto: cambio de ambiente/fuente sin reiniciar, con politicas robustas.
- Referencias:
  - [next-steps.md](next-steps.md)
  - [ENDPOINTS_GUIDE.md](../testing/ENDPOINTS_GUIDE.md)

### 2026-06-18
- Estado: active
- Resumen: normalizacion de documentacion para reflejar un solo servidor activo y consolidacion del historial en este timeline.
- Impacto: reduce ambiguedad entre estado actual e historico.
- Referencias:
  - [ENDPOINTS_GUIDE.md](../testing/ENDPOINTS_GUIDE.md)
  - [next-steps.md](next-steps.md)

### 2026-06-22 / 2026-06-23
- Estado: active
- Resumen: estabilizacion y observabilidad del sistema runtime. Se afinó el health check de MySQL, se expuso metadata de caché y latencia real, se modularizó el index.ts, y se eliminó el endpoint redundante `/api/health/data-source`.
- Impacto: mayor visibilidad del comportamiento del sistema sin cambiar la lógica de negocio. El endpoint `/api/runtime/status` se convierte en el punto único de diagnóstico de runtime.
- Cambios técnicos:
  - `MYSQL_HEALTH_TIMEOUT_MS` ajustado a 3000ms para absorber latencia de reactivación tras periodos de inactividad
  - `MYSQL_HEALTH_TTL_MS` establecido en 15000ms para estabilidad del cache
  - Health check ahora mide y expone `dbLatency`, `lastCheckTimedOut` y `timeSinceLastCheck`
  - `mysqlAvailable` pasa a `boolean | null` para no mentir cuando el middleware está desactivado
  - Endpoints de health/runtime extraídos de `index.ts` a `routes/runtimeRoutes.ts`
  - Eliminado `/api/health/data-source` (redundante con `/api/runtime/status`)
  - Contexto default de runtime ahora devuelve `reason: runtime_context_default_no_health_check` cuando el middleware está inactivo
- Referencias:
  - [RUNTIME_STATUS_ENDPOINT.md](../runtime/RUNTIME_STATUS_ENDPOINT.md)
  - [ENDPOINTS_GUIDE.md](../testing/ENDPOINTS_GUIDE.md)
  - [backend/src/runtime/mysqlHealth.ts](../../backend/src/runtime/mysqlHealth.ts)
  - [backend/src/routes/runtimeRoutes.ts](../../backend/src/routes/runtimeRoutes.ts)

---

## Pendientes de verificacion funcional
- Validar comportamiento de `GET /api/users/by-username/:username` en el backend activo.
- Referencia de ruta:
  - [backend/src/routes/userRoutes.ts](../../backend/src/routes/userRoutes.ts#L27)
