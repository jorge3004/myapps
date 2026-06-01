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
