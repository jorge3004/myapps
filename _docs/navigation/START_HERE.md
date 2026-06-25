# Start Here
Ultima actualizacion: 2026-06-24
Estado: active
Ambito: actual

## Estado actual (Estamos aqui)

- Backend activo unico en Node/TypeScript.
- Runtime por request estable con observabilidad en /api/runtime/status.
- Health check MySQL con cache, timeout tunable y latencia visible.
- Modelo de acceso ya separado en dos capas practicas:
  - acceso a app
  - autorizacion granular por scopes
- Endpoints nuevos para asociar usuario-app sin SQL manual:
  - POST /api/users/:userId/apps
  - DELETE /api/users/:userId/apps/:appId

Referencia primaria de estado:
- [IMPLEMENTATION_TIMELINE.md](IMPLEMENTATION_TIMELINE.md)

## Direccion (A donde vamos)

1. Consolidar modelo de acceso por capas:
   - identity prerequisite (AuthN)
   - app access gate
   - resource authorization (AuthZ)
2. Estandarizar permisos para user token y app token.
3. Mantener observabilidad de runtime y reducir ruido en responses.
4. Completar validacion funcional de endpoints pendientes.

Referencia de diseño:
- [auth/README.md](../auth/README.md)
- [authz/README.md](../authz/README.md)
- [AUTHZ_MODEL_V2.md](../authz/AUTHZ_MODEL_V2.md)
- [AUTH_AUTHZ_GLOSSARY.md](AUTH_AUTHZ_GLOSSARY.md)

## Siguiente inmediato (Now)

1. Cerrar validacion de auth/login (casos restantes + regresion de app access).
2. Validar endpoints nuevos de user-app en Insomnia:
   - alta de acceso
   - baja de acceso
   - login posterior por appId
3. Corregir endpoint pendiente de verificacion:
   - GET /api/users/by-username/:username
4. Marcar Estado prueba en la tabla maestra.

Referencia operativa:
- [ENDPOINTS_GUIDE.md](../testing/ENDPOINTS_GUIDE.md)
- [USERS_TEST_README.md](../testing/USERS_TEST_README.md)
- [AUTHZ_AUTOMATED_TESTS.md](../testing/AUTHZ_AUTOMATED_TESTS.md)

## Regla de lectura recomendada

- Si quieres entender contexto historico: timeline primero.
- Si quieres ejecutar pruebas ya: endpoints guide + users test.
- Si quieres entender el modelo conceptual: authz modular.

## Regla de mantenimiento de docs

- No borrar docs historicas.
- Marcar estado: active, superseded o deprecated.
- Cuando se cree un doc nuevo, enlazarlo desde este archivo.
