# Notas TypeScript (flags estrictos y errores corregidos)

Configuración: [backend/tsconfig.json](../../backend/tsconfig.json). Comando para ver errores:

```bash
cd backend && npx tsc --noEmit -p .
```

## Idea por flag

| Flag | Código | Idea |
|------|--------|------|
| `noUnusedParameters` | TS6133 | Un parámetro que no se usa se prefija con `_` (`_req`). |
| `noImplicitReturns` | TS7030 | Todas las ramas de una función hacen `return valor`, o ninguna. |
| `noUncheckedIndexedAccess` | — | `req.params.x` es `string \| undefined`: validar antes de usar. |
| `exactOptionalPropertyTypes` | TS2375 / TS2379 / TS2769 | `x?: string` significa "la clave puede faltar", **no** "puede valer `undefined`". |

## Cómo rehacer cada error (y arreglarlo)

Para cada ejercicio: aplica el "Rompe", corre `tsc`, verifica el código, y aplica el "Arregla".

### 1. `req` sin usar — [auditRoutes.ts](../../backend/src/routes/auditRoutes.ts)

- Rompe: `router.get('/', (req, res) => ...)` sin usar `req` → TS6133.
- Arregla: renombrar a `_req`. El `_` le dice a TS "lo ignoro a propósito" (igual que `_res`).

### 2. `description: string | undefined` hacia `description?: string` — [appService.ts](../../backend/src/services/appService.ts)

- Rompe: quitar el `| undefined` del tipo `{ name: string; description?: string }` y llamar con `description` que viene de `req.body` (puede ser `undefined`) → TS2379.
- Dos salidas:
  - Declarar `description?: string | undefined` ("acepto que me pasen `undefined` explícito"). Se usó para **parámetros de entrada** (`register` en [appService.ts](../../backend/src/services/appService.ts), [appRepository.ts](../../backend/src/repositories/appRepository.ts), [MysqlAppRepository.ts](../../backend/src/repositories/mysql/MysqlAppRepository.ts), [MemoryAppRepository.ts](../../backend/src/repositories/memory/MemoryAppRepository.ts)): el llamador no debería preocuparse.
  - Omitir la clave si no existe: `...(description !== undefined && { description })`. Se usó donde se **construye un objeto `App`** que se guarda/devuelve: en `createApp` dentro de [MysqlAppRepository.ts](../../backend/src/repositories/mysql/MysqlAppRepository.ts) y en el `Map` inicial de [MemoryAppRepository.ts](../../backend/src/repositories/memory/MemoryAppRepository.ts) (`createdAt`, error TS2769 con un mensaje larguísimo: leer la última línea, ahí está la causa real).
- Criterio: tipo de entrada → `| undefined`; objeto de dominio guardado → no incluir claves vacías.

### 3. Mismo patrón en runtime — [runtime/types.ts](../../backend/src/runtime/types.ts)

- Rompe: `RuntimeResolutionInput.requestedEnvironment?: string` recibe `headerValue(...)` (`string | undefined`) en [runtimeContext.ts](../../backend/src/middleware/runtimeContext.ts) → TS2379.
- Y `RuntimeResolvedContext.reason?: string` recibe `let reason: string | undefined` en [resolve.ts](../../backend/src/runtime/resolve.ts) → TS2375.
- Arregla: `?: string | undefined` en esos campos de `types.ts` (son valores que genuinamente pueden no venir).

### 4. Variables de entorno — [db.ts](../../backend/src/db.ts)

- Rompe: `host: process.env.DB_HOST` → `string | undefined` no cabe en `PoolOptions` (TS2769).
- No uses `!` (silencia el error pero falla tarde y confuso). Arregla validando al arrancar con `requireEnv('DB_HOST')`, que lanza `Missing required environment variable: DB_HOST`.

### 5. `noImplicitReturns` — [authRoutes.ts](../../backend/src/routes/authRoutes.ts), [runtimeContext.ts](../../backend/src/middleware/runtimeContext.ts)

- Rompe: en un handler donde unas ramas hacen `return res.status(...)` y otra hace `res.json(...)` sin `return` (o `next()` sin `return`) → TS7030.
- Arregla: poner `return` en todas las ramas (`return res.json({ token })`, `return next()`).

## Refactor ligado: leer parámetros obligatorios

[controllers/helpers/requestParams.ts](../../backend/src/controllers/helpers/requestParams.ts) (`requireParam`, `requireScopeString`, `validateScope`) valida `req.params`/`req.body` lanzando `Error`; el `catch` del controlador lo convierte en `400 { error }`. Esto evita `if (!userId) return res.status(400)...` repetido y, con `noImplicitReturns`, evita `return;` sueltos.
