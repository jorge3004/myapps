# Notas SQL (Resumen Teorico)

## ALTER TABLE vs UPDATE

- `ALTER TABLE`: cambia estructura (columnas, indices, constraints).
- `UPDATE ... SET ...`: cambia datos en filas existentes.
- En migraciones suelen usarse juntos: primero estructura, luego normalizacion de datos.

Ejemplo:

```sql
ALTER TABLE users ADD COLUMN revoked_scopes JSON NULL;
UPDATE users SET revoked_scopes = JSON_ARRAY() WHERE revoked_scopes IS NULL;
```

## SHOW vs SELECT

- `SHOW`: inspecciona metadatos/estructura.
- `SELECT`: consulta datos o evalua expresiones.

Ejemplo:

```sql
SHOW COLUMNS FROM users;
SHOW CREATE TABLE users;
SELECT id, username FROM users LIMIT 5;
SELECT JSON_ARRAY('a', 'b');
```

## SHOW COLUMNS: Field, LIKE y WHERE

- `Field` es columna del resultado de `SHOW COLUMNS`, no columna fisica de `users`.
- `SHOW COLUMNS FROM users LIKE 'revoked_scopes';` filtra por nombre de columna (`Field`).
- `SHOW COLUMNS FROM users WHERE Field LIKE '%scope%';` tambien filtra por `Field`.
- Si quieres filtrar por tipo:

```sql
SHOW COLUMNS FROM users WHERE Type LIKE 'json%';
```

## JSON en MySQL vs JavaScript

- `JSON` en MySQL es tipo de columna (contenedor).
- `JSON_ARRAY()` construye un valor JSON tipo arreglo.
- `JSON_OBJECT()` construye un valor JSON tipo objeto.

Comparacion rapida:

- JS objeto `{ a: 1 }` <-> JSON objeto en MySQL.
- JS arreglo `["x", "y"]` <-> JSON arreglo en MySQL.

Ejemplos:

```sql
SELECT JSON_ARRAY(
  JSON_OBJECT('appId','catalog','role','admin'),
  JSON_OBJECT('appId','billing','role','user')
);

UPDATE users
SET revoked_scopes = JSON_ARRAY('catalog:read:users', 'catalog:write:users')
WHERE id = 'u1';
```

Nota: con `SELECT` solo visualizas/evaluas; con `UPDATE/INSERT` persistes.

## Estrictez de columna JSON

Recomendacion practica para este proyecto:

- Base suficiente: `JSON NOT NULL` + default `[]` + validacion en backend.
- Usa `CHECK` solo si quieres forzar forma fija (solo arreglo o solo objeto).

Opcional (forzar arreglo):

```sql
ALTER TABLE users
  ADD CONSTRAINT chk_revoked_scopes_array
  CHECK (JSON_TYPE(revoked_scopes) = 'ARRAY');
```

Opcional (forzar objeto):

```sql
ALTER TABLE users
  ADD CONSTRAINT chk_revoked_scopes_object
  CHECK (JSON_TYPE(revoked_scopes) = 'OBJECT');
```

## Transacciones en Seeds (resumen)

- `START TRANSACTION ... COMMIT` tiene valor cuando el seed escribe en varias tablas y quieres consistencia.
- `ROLLBACK` deshace cambios DML pendientes de la transaccion en la misma sesion.
- En MySQL, DDL (`CREATE/ALTER/DROP`) suele hacer commit implicito; por eso el mayor beneficio transaccional esta en DML.

Ventajas:
- evita estados parciales de datos
- permite validar y decidir commit/rollback en flujo manual

Desventajas/limites:
- no reemplaza backups
- no funciona como control de versiones tipo Git

## ON DUPLICATE KEY UPDATE (resumen)

- Sirve para idempotencia de seed a nivel fila.
- Si existe PK/UNIQUE, actualiza columnas definidas.
- Si no existe, inserta.
- No corrige estructura de tabla (schema).

## Migración Mixta (DDL + DML)

- Util para bootstrap rapido en etapa temprana cuando estructura y datos estan acoplados.
- Recomendacion al crecer el proyecto: separar schema y data para rollback/debug mas fino.
- En este repo, la ruta principal actual de bootstrap es:

```text
backend/migrations/20260716_bootstrap_dev_mixed.sql
```
