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

## Pendientes

 - UI de administración (React + TypeScript recomendado)
   - Crear una aplicación web para administrar apps, usuarios, roles y permisos.
   - Funcionalidades sugeridas:
     - Listar y buscar usuarios
     - Ver y editar roles/scopes de cada usuario
     - Crear, editar y eliminar apps
     - Visualizar historial de auditoría
   - Usar TypeScript en el frontend para mantener la robustez y coherencia de tipos con el backend.
   - Integrar autenticación JWT y protección de rutas en la UI.
- Consolidar modelo de acceso por capas:
  - identity prerequisite (AuthN)
  - app access gate
  - resource authorization (AuthZ)
- Validar comportamiento de `GET /api/users/by-username/:username` en el backend activo.
- Verificar que implementación de auditoría de cambios de permisos esté completa y funcional (registrada en este documento 2026-05-29).
- Cerrar validacion de auth/login (casos restantes + regresion de app access).
  -Validar endpoints nuevos de user-app en Insomnia:
  - alta de acceso
  - baja de acceso
  - login posterior por appId
.

---

## Hitos

### 2026-06-24
- Estado: active
- Resumen: Endpoints nuevos para asociar usuario-app sin SQL manual:
  - POST /api/users/:userId/apps
  - DELETE /api/users/:userId/apps/:appId
- Impacto: simplifica la gestion de accesos de usuarios a aplicaciones, eliminando la necesidad de escribir consultas SQL manuales y reduciendo errores potenciales.
- Cambios técnicos:
  - Implementación de endpoints RESTful para la asociación y desasociación de usuarios con aplicaciones.


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
  - [RUNTIME_STATUS_ENDPOINT.md](runtime/RUNTIME_STATUS_ENDPOINT.md)


### 2026-06-18
- Estado: active
- Resumen: normalizacion de documentacion para reflejar un solo servidor activo y consolidacion del historial en este timeline.
- Impacto: reduce ambiguedad entre estado actual e historico.
- Referencias:
  - [ENDPOINTS_GUIDE.md](../testing/ENDPOINTS_GUIDE.md)

### 2026-06-17
- Estado: active
- Resumen: runtime dinamico por request (x-runtime-env, x-data-source), fallback controlado y observabilidad.
- Impacto: cambio de ambiente/fuente sin reiniciar, con politicas robustas.
- Cambios técnicos:
  - `DataSourceProvider (plug & play)` El objetivo es poder cambiar de mysql a memory (o cualquier otro backend) con una sola variable de entorno DATA_SOURCE=mysql|memory, sin tocar lógica de negocio ni controladores. [Detalles](runtime/Dynamic_runtime_implementation.md)
  - `/runtime/status` Información del endpoint que expone el estado del runtime y la disponibilidad de MySQL. [Detalles](runtime/RUNTIME_STATUS_ENDPOINT.md)

- Referencias:
  - [RUNTIME_STATUS_ENDPOINT.md](../runtime/RUNTIME_STATUS_ENDPOINT.md)
  - [ENDPOINTS_GUIDE.md](../testing/ENDPOINTS_GUIDE.md)
  - [backend/src/runtime/mysqlHealth.ts](../../backend/src/runtime/mysqlHealth.ts)
  - [backend/src/routes/runtimeRoutes.ts](../../backend/src/routes/runtimeRoutes.ts)

### 2026-06-01
- Estado: active
- Resumen: migracion fuerte a MySQL (users, apps, api_keys, user_apps), seed/migrations consolidadas.
- Impacto: persistencia real y abandono del in-memory como fuente principal.
- Referencias:
  - [backend-db-schema-inicial.md](../data/backend-db-schema-inicial.md)


### 2026-05-29
- Estado: active
- Resumen: Implmentacion de auditoria de acciones y cambios de permisos (logs de quien, cuando y que cambio sobre scopes, roles y usuarios).
- Impacto: Trazabilidad de cambios y seguridad reforzada.

  - `Implementar logs/auditoría` registrar quién, cuándo y qué cambios realiza sobre scopes, roles y usuarios.
  - `Guardar información relevante` usuario que realiza la acción, usuario afectado, tipo de cambio, timestamp, valores antes/después. 
   - `Considerar endpoint para consultar historial de cambios por usuario.`


### 2026-05-28
- Estado: active
- Resumen: definicion de revocacion global/especifica de API keys y convenciones de scopes/roles.
- Impacto: seguridad y trazabilidad de permisos.
- Referencias:
  - [APIKEYS_ENDPOINTS.md](../auth/APIKEYS_ENDPOINTS.md)


### 2026-05-27
- Estado: superseded (parcial)
- Resumen: estabilizacion inicial de endpoints y debugging de imports/workspaces.
- centralización de la lógica de usuarios y aplicaciones en backend y packages/user-management, application-management.
- implementacion de endpoint robusto GET /api/users con paginación estándar (limit, offset).
- Correccion de problemas de import/export entre routers y controladores.
- configuracion del monorepo con npm workspaces para enlazar correctamente los paquetes locales.
- Se corrigió el método listAllUsers y se garantizó que TypeScript use la versión fuente.
- Se solucionaron errores de tipos y dependencias (@types/jsonwebtoken, etc).
- Se limpió y robusteció el script de arranque para evitar procesos colgados en el puerto 4000.
- Se documentó la estructura y el flujo de debugging para futuras referencias.
- Impacto: base funcional para migracion posterior a MySQL y runtime dinamico.



### 2026-05-11
- Estado: superseded
- Resumen: se propuso modularizacion via packages (user-management, app-management).
- Impacto: vision de reutilizacion, luego evolucionada a implementacion local en backend TypeScript.
- Referencias:
  - [modularizacion.md](../history/modularizacion.md)

### 2026-05-09
- Estado: superseded (parcial)
- Resumen: se definio la arquitectura inicial de monorepo con core backend/frontend y apps por dominio.
- Impacto: establecio base conceptual del proyecto.
- Referencias:
  - [architecture-map-2026-05-09.md](../history/architecture-map-2026-05-09.md)

