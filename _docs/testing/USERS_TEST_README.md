# Test Users & Login

## Admin User
- **Username:** jorge
- **Password:** jorge123
- **Role:** admin (global)
- **Scopes:** ["*"]
- **appIds:** ["*"]
- **rolesPorApp:** { "*": "admin" }
- **Login body:**
  ```json
  {
    "username": "jorge",
    "password": "jorge123"
  }
  ```

## Test User
- **Username:** test
- **Password:** test123
- **Role:** user (scoped)
- **Scopes:** ["ratw3urj:read:users", "ratw3urj:read:catalogs"]
- **appIds:** (none by default)
- **rolesPorApp:** (none by default)
- **Login body:**
  ```json
  {
    "username": "test",
    "password": "test123",
    "appId": "ratw3urj"
  }
  ```

## Notas
- El usuario admin puede loguearse sin appId.
- El usuario test requiere appId válido para login.
- Ambos usuarios están inicializados automáticamente en memoria al arrancar el backend.

## Tutorial breve: dar acceso de app a un usuario existente

Caso típico: el login de `editor` devuelve `403 User does not have access to this app`.

Esto ocurre porque `POST /api/auth/login` valida acceso en `user_apps`.

### 1) Obtener token admin

```json
POST /api/auth/login
{
  "username": "jorge",
  "password": "jorge123"
}
```

### 2) Buscar `userId` del usuario objetivo

```http
GET /api/users?limit=100&offset=0
Authorization: Bearer <ADMIN_TOKEN>
```

En la respuesta, toma el `id` del usuario `editor`.

### 3) Asignar acceso de app por endpoint

```json
POST /api/users/:userId/apps
Authorization: Bearer <ADMIN_TOKEN>
{
  "appId": "795145432d094d5f",
  "role": "editor"
}
```

`role` es opcional. Si no lo mandas, se asume `user`.

Roles válidos actuales: `admin`, `editor`, `user`.

### 4) Probar login con appId

```json
{
  "username": "editor",
  "password": "editor123",
  "appId": "795145432d094d5f"
}
```

Resultado esperado: `200` con `token`.

## Aclaración importante: scopes vs acceso a app

- `POST /api/users/:userId/scopes` **sí existe**, pero solo agrega scopes directos (`users.scopes`).
- El login con `appId` valida pertenencia en `user_apps` (app-role mapping).
- `user_apps` responde a: “¿puede entrar a esta app?”
- `role` dentro de `user_apps` responde a: “¿qué perfil tendrá dentro de esa app?”
- Por lo tanto, agregar scopes directos **no sustituye** asignar `user_apps`.
- Si solo quieres habilitar acceso y no te importa el perfil aún, omite `role` y quedará `user` por defecto.

En resumen:
- Para permisos finos: `POST /api/users/:userId/scopes`
- Para permitir login con una app específica: `POST /api/users/:userId/apps`

## Tests automatizados (auth/authz)

Existe una suite automatizada para reglas de auth/authz y middleware:
- Ver [AUTHZ_AUTOMATED_TESTS.md](AUTHZ_AUTOMATED_TESTS.md)

Comandos:

```bash
npm run test
npm run test:authz
```

Importante:
- Estos tests actuales no tocan MySQL.
- No levantan servidor ni ejecutan queries SQL.
