# Scopes efectivos, derivados y directos

**Última actualización:** 2026-05-28

## Definiciones

- **Scopes derivados:**
  - Permisos generados automáticamente a partir de los roles asignados al usuario usando el mapeo `ROLE_SCOPES`.
  - Ejemplo: Si el usuario tiene rol `editor` en la app `ratw3urj`, los scopes derivados serán `ratw3urj:read:users` y `ratw3urj:write:catalogs`.

- **Scopes directos:**
  - Permisos agregados o quitados explícitamente al usuario en el campo `scopes`.
  - Se usan para excepciones o permisos especiales que no provienen del rol.
  - Ejemplo: Si a `editor` se le agrega `ratw3urj:delete:catalogs` en `scopes`, ese permiso es directo.

- **Scopes efectivos:**
  - Es la combinación de ambos: scopes derivados del rol + scopes directos asignados al usuario (sin duplicados).
  - Es lo que realmente valida el backend para acceso.



## Convención de IDs de usuario

- Todos los usuarios (incluidos los iniciales) usan IDs únicos generados automáticamente.
- Los IDs numéricos quedan obsoletos.
- **En desarrollo/local:** Se usa una función simpleId() para generar IDs cortos y únicos (no criptográficos).
- **IMPORTANTE:** Para producción, migrar a una solución robusta como [nanoid](https://github.com/ai/nanoid) para asegurar unicidad global y seguridad criptográfica.
- Los usuarios iniciales pueden usar valores fijos tipo NanoID para facilitar pruebas y documentación.

> ⚠️ **Advertencia:** La función simpleId() es solo para ambientes de desarrollo/local/testing. No garantiza unicidad global ni seguridad criptográfica. ¡Migrar a nanoid antes de producción!

## Ejemplo de respuesta del endpoint `/api/users/:userId/scopes`

```json
{
  "userId": "3",
  "scopesDerivados": [
    "ratw3urj:read:users",
    "ratw3urj:write:catalogs"
  ],
  "scopesDirectos": [
    "ratw3urj:delete:catalogs"
  ],
  "scopesEfectivos": [
    "ratw3urj:read:users",
    "ratw3urj:write:catalogs",
    "ratw3urj:delete:catalogs"
  ]
}
```

## Buenas prácticas
- El campo `scopes` del usuario debe usarse solo para excepciones.
- Si el usuario solo debe tener los permisos de su rol, deja `scopes: []` o no lo incluyas.
- El endpoint de scopes permite auditar y distinguir el origen de cada permiso.

## Endpoints para gestión dinámica de scopes y revokedScopes

### Autenticación

1. **POST `/auth/login`**
   - Body (JSON):
     ```json
     { "username": "<usuario>", "password": "<contraseña>" }
     ```
   - Respuesta: JWT para usar en los siguientes endpoints.

### Consultar scopes de un usuario

2. **GET `/users/:userId/scopes`**
   - Headers:
     - Authorization: Bearer <JWT>
   - Respuesta: Scopes derivados, directos, revocados y efectivos.

### Agregar un scope directo

3. **POST `/users/:userId/scopes`**
   - Headers:
     - Authorization: Bearer <JWT>
   - Body (JSON):
     ```json
     { "scope": "<appId>:<action>:<resource>" }
     ```
   - Valida formato y existencia del scope.

### Remover un scope directo

4. **DELETE `/users/:userId/scopes`**
   - Headers:
     - Authorization: Bearer <JWT>
   - Body (JSON):
     ```json
     { "scope": "<appId>:<action>:<resource>" }
     ```

### Revocar un scope (revokedScopes)

5. **POST `/users/:userId/revoked-scopes`**
   - Headers:
     - Authorization: Bearer <JWT>
   - Body (JSON):
     ```json
     { "scope": "<appId>:<action>:<resource>" }
     ```
   - El scope será excluido de los efectivos aunque lo tenga por rol o directo.

### Restaurar un scope revocado

6. **DELETE `/users/:userId/revoked-scopes`**
   - Headers:
     - Authorization: Bearer <JWT>
   - Body (JSON):
     ```json
     { "scope": "<appId>:<action>:<resource>" }
     ```

> Todos los endpoints requieren JWT válido y validan el formato y existencia del scope.

---

