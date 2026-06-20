# Timeline de Implementacion
Ultima actualizacion: 2026-06-18

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
  - [architecture-map-2026-05-09.md](architecture-map-2026-05-09.md)

### 2026-05-11
- Estado: superseded
- Resumen: se propuso modularizacion via packages (user-management, app-management).
- Impacto: vision de reutilizacion, luego evolucionada a implementacion local en backend TypeScript.
- Referencias:
  - [modularizacion.md](modularizacion.md)

### 2026-05-27
- Estado: superseded (parcial)
- Resumen: estabilizacion inicial de endpoints y debugging de imports/workspaces.
- Impacto: base funcional para migracion posterior a MySQL y runtime dinamico.
- Referencias:
  - [avance-backend-2026-05-27.md](avance-backend-2026-05-27.md)

### 2026-05-28
- Estado: active
- Resumen: definicion de revocacion global/especifica de API keys y convenciones de scopes/roles.
- Impacto: seguridad y trazabilidad de permisos.
- Referencias:
  - [APIKEYS_ENDPOINTS.md](APIKEYS_ENDPOINTS.md)
  - [SCOPE_CONVENTION.md](SCOPE_CONVENTION.md)
  - [scopes-vs-roles-2026-05-28.md](scopes-vs-roles-2026-05-28.md)
  - [auditoria-y-rotacion-apikeys-2026-05-28.md](auditoria-y-rotacion-apikeys-2026-05-28.md)

### 2026-06-01
- Estado: active
- Resumen: migracion fuerte a MySQL (users, apps, api_keys, user_apps), seed/migrations consolidadas.
- Impacto: persistencia real y abandono del in-memory como fuente principal.
- Referencias:
  - [backend-db-schema-inicial.md](backend-db-schema-inicial.md)
  - [backend-db-relacion-usuarios-apps.md](backend-db-relacion-usuarios-apps.md)
  - [backend-db-connection-flow.md](backend-db-connection-flow.md)
  - [next-steps.md](next-steps.md)

### 2026-06-17
- Estado: active
- Resumen: runtime dinamico por request (x-runtime-env, x-data-source), fallback controlado y observabilidad.
- Impacto: cambio de ambiente/fuente sin reiniciar, con politicas robustas.
- Referencias:
  - [next-steps.md](next-steps.md)
  - [ENDPOINTS_GUIDE.md](ENDPOINTS_GUIDE.md)

### 2026-06-18
- Estado: active
- Resumen: normalizacion de documentacion para reflejar un solo servidor activo y consolidacion del historial en este timeline.
- Impacto: reduce ambiguedad entre estado actual e historico.
- Referencias:
  - [ENDPOINTS_GUIDE.md](ENDPOINTS_GUIDE.md)
  - [next-steps.md](next-steps.md)

---

## Pendientes de verificacion funcional
- Validar comportamiento de `GET /api/users/by-username/:username` en el backend activo.
- Referencia de ruta:
  - [backend/src/routes/userRoutes.ts](../backend/src/routes/userRoutes.ts#L27)
