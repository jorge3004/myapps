# Mapa de Documentacion
Ultima actualizacion: 2026-06-24
Estado: active
Ambito: actual

## Navegacion por objetivo

### 1) Quiero probar endpoints ahora
- [ENDPOINTS_GUIDE.md](../testing/ENDPOINTS_GUIDE.md)
- [USERS_TEST_README.md](../testing/USERS_TEST_README.md)
- [RUNTIME_STATUS_ENDPOINT.md](../runtime/RUNTIME_STATUS_ENDPOINT.md)

### 2) Quiero entender login, acceso a app y permisos
- [authz/00_README.md](../authz/00_README.md)
- [AUTHZ_MODEL_V2.md](../authz/AUTHZ_MODEL_V2.md)
- [authentication-design.md](../auth/authentication-design.md)
- [SCOPE_CONVENTION.md](../authz/SCOPE_CONVENTION.md)
- [AUTH_AUTHZ_GLOSSARY.md](AUTH_AUTHZ_GLOSSARY.md)

### 3) Quiero saber que cambio y cuando
- [IMPLEMENTATION_TIMELINE.md](IMPLEMENTATION_TIMELINE.md)

### 4) Quiero contexto de datos/DB
- [backend-db-schema-inicial.md](../data/backend-db-schema-inicial.md)
- [backend-db-relacion-usuarios-apps.md](../data/backend-db-relacion-usuarios-apps.md)
- [backend-db-connection-flow.md](../data/backend-db-connection-flow.md)

## Historial y contexto (no eliminar)

Documentos historicos siguen siendo utiles para decisiones previas.
Si uno queda obsoleto, marcarlo como superseded en lugar de borrarlo.

## Convencion de carpetas aplicada

- _docs/authz: version modular por capas
- _docs/auth: autenticacion e identidad
- _docs/runtime: runtime y observabilidad
- _docs/data: esquema, relaciones y flujo DB
- _docs/testing: guias de prueba funcional
- _docs/history: arquitectura e hitos historicos

Nota: la reorganizacion fisica ya se aplico en 2026-06-24. Se mantienen archivos puente en rutas antiguas durante la transicion.
