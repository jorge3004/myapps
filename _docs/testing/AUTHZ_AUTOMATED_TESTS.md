# Tests automatizados de auth/authz
Ultima actualizacion: 2026-06-24
Estado: active
Ambito: actual

## Objetivo
Explicar que pruebas automatizadas existen hoy en backend para authentication/authorization,
como ejecutarlas y cual es su impacto real en MySQL.

## Resumen corto
- Tipo actual: unit tests (logica pura + middleware con mocks).
- Runner: Node test runner (`node:test`).
- Comando general: `npm run test`.
- Comando focalizado authz: `npm run test:authz`.
- Impacto en BD MySQL: ninguno.

## Donde viven
- `backend/src/tests/authorizationService.test.ts`
- `backend/src/tests/requireAppAccess.test.ts`

## Que cubre cada archivo

### 1) authorizationService.test.ts
Valida reglas del modelo de autorizacion central:
- mapeo base de `ROLE_SCOPES`
- derivacion de scopes efectivos
- mezcla de scopes por rol + scopes directos
- aplicacion de `revokedScopes`
- decision de acceso por app para user/admin
- matching de scopes con wildcards
- saneamiento de payload de scopes

### 2) requireAppAccess.test.ts
Valida el middleware de acceso por app:
- permite admin global
- permite usuario con app autorizada
- bloquea usuario sin acceso a app objetivo (403)
- valida `appId` requerido (400)

## Como ejecutar
Desde `backend/`:

1. Suite completa de tests existentes:

```bash
npm run test
```

2. Solo suite authz:

```bash
npm run test:authz
```

## Los tests tocan MySQL?
No.

Motivo tecnico:
- No levantan servidor Express.
- No importan `db.ts` ni repositorios MySQL.
- No ejecutan queries SQL.
- Usan objetos mockados en memoria para `req/res` y entidades de prueba.

En la practica:
- No insertan, actualizan ni borran datos en MySQL.
- Son seguras para correr localmente cuantas veces quieras.

## Limites actuales (importante)
Estos tests no reemplazan pruebas funcionales con endpoints reales.

Aun faltan (si queremos cobertura completa):
- tests de integracion HTTP contra rutas protegidas
- validacion end-to-end con JWT real
- validacion en datasource MySQL real (entorno controlado)

## Recomendacion operativa
Usar este orden:
1. `npm run test` (regresion rapida de reglas auth/authz)
2. Pruebas en Insomnia (flujo real de endpoints)
3. Cuando exista entorno dedicado, agregar integracion con MySQL aislada
