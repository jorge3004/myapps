# Backend MySQL Connection Flow

## ¿Dónde y cómo se inicializa la conexión a la base de datos?

La conexión a MySQL se inicializa automáticamente la **primera vez que se importa** el archivo `backend/src/db.ts` en cualquier parte del backend. No es necesario importarlo manualmente en `index.ts`.

## Flujo de inicialización

```mermaid
graph TD
    A[Express server inicia (index.ts)] --> B[Se recibe una petición HTTP]
    B --> C[Se ejecuta un controlador (por ejemplo, userController.ts)]
    C --> D[El controlador importa userService.ts]
    D --> E[userService.ts importa user.ts (modelo)]
    E --> F[user.ts importa pool desde db.ts]
    F --> G[db.ts ejecuta mysql.createPool y exporta pool]
    G --> H[pool se usa para queries SQL]
```

## Ejemplo de importación en el modelo

```typescript
// backend/src/models/user.ts
import pool from '../db';

export async function getUserById(id: string) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}
```

## Resumen
- La conexión se crea automáticamente al importar `db.ts`.
- El primer endpoint que use un modelo que importe `db.ts` inicializa el pool.
- No es necesario importar `db.ts` en `index.ts`.
- El pool se reutiliza en todo el backend.

---
**Ubicación de la lógica de conexión:**
- Archivo: `backend/src/db.ts`
- Usado por: Todos los modelos que interactúan con la base de datos.

---
> **Nota:** Si quieres forzar la conexión al arrancar el backend, puedes importar y hacer un `await pool.getConnection()` en `index.ts`, pero no es obligatorio ni común en aplicaciones Express.
