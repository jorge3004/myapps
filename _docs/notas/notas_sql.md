# Notas SQL (Resumen Teorico)

## Tablas relacionadas: idea base

- Una tabla puede depender de otra usando una clave foranea (`FOREIGN KEY`).
- La tabla referenciada suele llamarse padre.
- La tabla que guarda la referencia suele llamarse hija.
- La relacion existe en el schema aunque no uses `JOIN`.
- `JOIN` no crea relaciones; solo permite consultarlas juntas.

Ejemplo de este repo:

- `users` es padre de `user_apps`
- `apps` es padre de `user_apps`
- `apps` es padre de `api_keys`
- `user_apps` es tabla puente entre `users` y `apps`

Lectura mental rapida:

- `users`: quien es el usuario
- `apps`: cual es la aplicacion
- `user_apps`: que usuario tiene acceso a que app y con que rol

Ejemplo de `JOIN`:

```sql
SELECT
  u.username,
  a.name,
  ua.role
FROM user_apps ua
JOIN users u ON u.id = ua.user_id
JOIN apps a ON a.id = ua.app_id;
```

Eso no crea nada nuevo; solo muestra la relacion ya definida por las foreign keys.

## Tipos de JOIN (resumen practico)

- `JOIN` e `INNER JOIN` son equivalentes en MySQL.
- `INNER JOIN` devuelve solo filas con match en ambas tablas.
- `LEFT JOIN` devuelve todas las filas de la tabla izquierda aunque no tengan match.
- `RIGHT JOIN` devuelve todas las filas de la tabla derecha aunque no tengan match.
- En la practica, muchos equipos usan mas `LEFT JOIN` que `RIGHT JOIN` porque suele ser mas legible.

Ejemplo INNER JOIN (solo usuarios que si tienen app asignada):

```sql
SELECT u.username, a.name, ua.role
FROM users u
INNER JOIN user_apps ua ON ua.user_id = u.id
INNER JOIN apps a ON a.id = ua.app_id;
```

Ejemplo LEFT JOIN (incluye usuarios sin apps):

```sql
SELECT u.username, ua.app_id, ua.role
FROM users u
LEFT JOIN user_apps ua ON ua.user_id = u.id;
```

Si un usuario no tiene filas en `user_apps`, en columnas de `ua.*` veras `NULL`.

Ejemplo RIGHT JOIN (equivalente logico invirtiendo el orden del LEFT):

```sql
SELECT u.username, ua.app_id, ua.role
FROM user_apps ua
RIGHT JOIN users u ON ua.user_id = u.id;
```

Regla practica:

- Si dudas entre `LEFT` y `RIGHT`, escribe el query con `LEFT JOIN` y pon como tabla izquierda la que quieras conservar completa.

### Comparacion visual rapida (con tus datos seed)

Contexto del seed actual:

- `users`: `jorge`, `editor`, `user`
- `user_apps`: los 3 usuarios tienen al menos una app asignada

Si ejecutas los ejemplos anteriores, el resultado esperado seria:

| Tipo | Que conserva | Filas esperadas con seed actual |
|---|---|---|
| `INNER JOIN` | solo filas con match en ambas tablas | 4 |
| `LEFT JOIN` (`users` a la izquierda) | todos los usuarios, tengan o no app | 4 (hoy) |
| `RIGHT JOIN` (`users` a la derecha) | todos los usuarios, tengan o no app | 4 (hoy) |

Nota importante:

- Hoy `INNER`, `LEFT` y `RIGHT` te devuelven el mismo conteo porque todos los usuarios tienen al menos una relacion en `user_apps`.
- Si agregas un usuario sin filas en `user_apps`, `INNER` lo excluye, pero `LEFT/RIGHT` lo muestran con `NULL` en columnas de `ua.*`.

### Alias en SQL (u, a, ua): que significan

En SQL puedes poner un alias corto a una tabla para escribir menos y leer mas facil.

Ejemplo:

```sql
FROM users u
```

Significa:

- tabla real: `users`
- alias temporal dentro de ese query: `u`

Con eso, en lugar de escribir `users.username`, escribes `u.username`.

No son variables ni columnas nuevas. Son solo apodos temporales para ese query.

Ejemplo completo:

```sql
SELECT u.username, a.name, ua.role
FROM users u
INNER JOIN user_apps ua ON ua.user_id = u.id
INNER JOIN apps a ON a.id = ua.app_id;
```

Lectura linea por linea:

1) `FROM users u`

- arranca desde la tabla `users`
- en este query la llamaremos `u`

2) `INNER JOIN user_apps ua ON ua.user_id = u.id`

- une la tabla puente `user_apps` (alias `ua`)
- condicion de union: el `user_id` de `ua` debe coincidir con el `id` de `u`
- como es `INNER JOIN`, si no hay coincidencia, esa fila no aparece

3) `INNER JOIN apps a ON a.id = ua.app_id`

- une la tabla `apps` (alias `a`)
- condicion: el `id` de `apps` debe coincidir con `app_id` de `ua`

4) `SELECT u.username, a.name, ua.role`

- de la tabla `users` (alias `u`) trae `username`
- de la tabla `apps` (alias `a`) trae `name`
- de la tabla puente `user_apps` (alias `ua`) trae `role`

Traduccion mental rapida del resultado:

- que usuario (`u.username`)
- en que app (`a.name`)
- con que rol (`ua.role`)

Sin alias, el mismo query se veria asi (mas largo):

```sql
SELECT users.username, apps.name, user_apps.role
FROM users
INNER JOIN user_apps ON user_apps.user_id = users.id
INNER JOIN apps ON apps.id = user_apps.app_id;
```

Regla practica:

- usa alias cortos y consistentes (`u`, `a`, `ua`) cuando el query tiene joins.
- si el query es muy corto, tambien puedes escribir nombres completos.

### LEFT JOIN a detalle (con NULL)

Objetivo:

- ver como `LEFT JOIN` conserva todas las filas de la tabla izquierda
- entender por que aparecen `NULL` cuando no existe relacion en la tabla derecha

Query base:

```sql
SELECT
  u.id,
  u.username,
  ua.app_id,
  ua.role
FROM users u
LEFT JOIN user_apps ua ON ua.user_id = u.id
ORDER BY u.username, ua.app_id;
```

Como se lee:

1. tabla izquierda: `users u`
2. intenta encontrar match en `user_apps ua` por `ua.user_id = u.id`
3. si encuentra match, muestra datos de `ua`
4. si NO encuentra match, igual muestra la fila de `u` y pone `NULL` en columnas de `ua`

Mini laboratorio (seguro):

```sql
-- 1) Crear usuario sin apps asignadas
INSERT INTO users (id, username, email, password_hash, role, scopes, revoked_scopes)
VALUES ('left_demo_01', 'leftdemo', 'leftdemo@example.com', '$2b$10$2G0kHBfFZn9b12KScl2O6uVgoa6e7nEfmjKeNW20mX93STr141kpC', 'user', JSON_ARRAY(), JSON_ARRAY());

-- 2) INNER JOIN: este usuario NO aparece (no tiene match en user_apps)
SELECT u.username, ua.app_id, ua.role
FROM users u
INNER JOIN user_apps ua ON ua.user_id = u.id
WHERE u.id = 'left_demo_01';

-- 3) LEFT JOIN: este usuario SI aparece, con ua.app_id y ua.role en NULL
SELECT u.username, ua.app_id, ua.role
FROM users u
LEFT JOIN user_apps ua ON ua.user_id = u.id
WHERE u.id = 'left_demo_01';

-- 4) Limpiar prueba
DELETE FROM users WHERE id = 'left_demo_01';
```

Resultado esperado:

- `INNER JOIN` devuelve 0 filas para `left_demo_01`
- `LEFT JOIN` devuelve 1 fila para `left_demo_01` con `NULL` en columnas de `ua.*`

## Borrar datos cuando hay dependencias

- Si una fila padre esta siendo usada por filas hijas, MySQL normalmente no te dejara borrarla.
- Primero borras las filas hijas, luego la fila padre.
- Esto lo valida MySQL a nivel base de datos si existe una `FOREIGN KEY`.
- El backend puede agregar validaciones propias, pero no reemplaza la validacion de MySQL.

Ejemplo:

```sql
DELETE FROM user_apps WHERE user_id = 'f1a2b3c4d5e6f703';
DELETE FROM users WHERE id = 'f1a2b3c4d5e6f703';
```

Antes de borrar, puedes inspeccionar la relacion:

```sql
SELECT u.username, ua.app_id, ua.role
FROM users u
LEFT JOIN user_apps ua ON ua.user_id = u.id
WHERE u.id = 'f1a2b3c4d5e6f703';
```

## Borrado automatico de filas: ON DELETE CASCADE

- MySQL puede borrar filas hijas automaticamente si la foreign key fue creada con `ON DELETE CASCADE`.
- Eso evita tener que hacer dos `DELETE` manuales.
- Es una regla del schema en MySQL, no una regla del backend.

Ejemplo conceptual:

```sql
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

Si esa regla existe:

- borras una fila en `users`
- MySQL borra automaticamente sus filas relacionadas en `user_apps`

Precaucion:

- `ON DELETE CASCADE` sirve para `DELETE` de datos.
- No significa que puedas hacer `DROP TABLE` en cualquier orden.

## Borrar tablas relacionadas (DROP TABLE)

- Para borrar tablas enteras, normalmente debes borrar primero las hijas y luego las padres.
- En este repo: primero `user_apps` y `api_keys`, despues `users` y `apps`.
- Esto es porque las hijas contienen foreign keys hacia las padres.

Ejemplo:

```sql
DROP TABLE IF EXISTS user_apps;
DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS apps;
```

Si intentas borrar primero la tabla padre, MySQL puede rechazarlo por integridad referencial.

Alternativa tecnica que existe pero debe usarse con cuidado:

```sql
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE users;
DROP TABLE user_apps;
SET FOREIGN_KEY_CHECKS = 1;
```

Eso desactiva validaciones temporalmente, pero en desarrollo solo debe usarse sabiendo exactamente lo que haces. Para aprender y para scripts claros, conviene respetar el orden correcto en lugar de desactivar checks.

## Errores tipicos de foreign keys

- Error tipico al borrar una fila padre:

```text
Cannot delete or update a parent row: a foreign key constraint fails
```

Significa:

- estas intentando borrar o cambiar una fila padre
- pero una tabla hija todavia la referencia

Que revisar primero:

- que tabla hija apunta a esa fila
- si primero debes borrar o actualizar las filas hijas
- si la foreign key tiene o no `ON DELETE CASCADE`

Ejemplo mental:

- quieres borrar un `users.id`
- pero `user_apps.user_id` todavia lo usa
- entonces MySQL bloquea el `DELETE`

Error tipico al borrar tablas en mal orden:

```text
Cannot drop table 'users' referenced by a foreign key constraint
```

Significa:

- intentaste hacer `DROP TABLE` sobre una tabla padre
- pero todavia existe una tabla hija con foreign key hacia ella

Que revisar primero:

- el orden de tus `DROP TABLE`
- si debes borrar antes `user_apps` o `api_keys`
- si estas desactivando `FOREIGN_KEY_CHECKS` sin necesidad

Regla practica:

- para `DELETE` de datos: piensa en filas hijas y filas padre
- para `DROP TABLE`: piensa en tablas hijas y tablas padre

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

## Seguridad operativa en produccion (DB)

Idea clave:

- No se confia en "nadie se equivoca".
- Se disenan permisos y procesos para que un error humano no tenga alcance catastrofico.

Reglas practicas:

- La cuenta del backend no debe tener permisos DDL (`DROP`, `ALTER`, `CREATE`).
- Separar cuentas por rol:
  - cuenta app: solo `SELECT/INSERT/UPDATE/DELETE`
  - cuenta migraciones: `ALTER/CREATE/DROP` (uso controlado)
  - cuenta de emergencia: acceso total, uso excepcional y auditado
- Los cambios de schema deben pasar por migraciones versionadas y revisadas.
- Habilitar backups frecuentes y, en produccion real, recuperacion a punto en el tiempo (binlog).
- Registrar auditoria de quien hizo cambios y cuando.

Sobre "bloquear cambios criticos":

- En MySQL, la defensa principal es control de privilegios y separacion de cuentas.
- Si una cuenta tiene permisos DDL amplios, puede eliminar o alterar objetos criticos.
- Por eso la cuenta "maestra" no debe usarse para operacion diaria.

Nota sobre cuenta maestra (break-glass):

- Debe usarse solo en emergencia.
- Idealmente con controles adicionales: MFA, aprobacion, trazabilidad y acceso temporal.

## Passwords y recuperacion (bcrypt)

- Con bcrypt no puedes recuperar la password original.
- Si un sistema te envia tu password actual por correo, probablemente no usa bcrypt correctamente (o guarda passwords de forma reversible, lo cual es riesgoso).
- Flujo correcto moderno: recuperar acceso con token temporal y luego definir password nueva.
- Regla de oro: nunca enviar password actual en texto plano al usuario.
