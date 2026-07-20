-- Bootstrap mixto de desarrollo para backend MySQL
-- Fecha: 2026-07-16
-- Base de datos: jirdcom_myapps
-- Proposito:
--   - recrear estructura minima necesaria del backend
--   - sembrar datos base de desarrollo en un solo archivo
--
-- CONTEXTO:
--   Este archivo une schema + seed en una sola ejecucion.
--   Los archivos canonicos separados se conservan para comparacion y referencia:
--     - 20260529_create_users_table.sql
--     - 20260529_create_user_apps_table.sql
--     - 20260601_create_apps_api_keys.sql
--     - 20260601_seed_dev.sql
--
-- CUANDO CONVIENE ESTE ENFOQUE:
--   - etapa temprana del proyecto
--   - bootstrap rapido de una base de desarrollo vacia
--   - cambios pequenos y acoplados entre estructura y datos
--
-- LIMITES IMPORTANTES:
--   - MySQL suele hacer COMMIT implicito en DDL (DROP/CREATE/ALTER).
--   - Por eso, el bloque START TRANSACTION/COMMIT de abajo protege sobre todo el seed (DML),
--     no el bloque de DROP/CREATE.
--   - Si quieres decidir manualmente COMMIT o ROLLBACK, ejecuta linea por linea o adapta
--     el bloque DML para quitar el COMMIT final.
--
-- VENTAJAS DEL BLOQUE TRANSACCIONAL EN EL SEED:
--   - evita dejar datos a medias entre varias tablas si una insercion falla
--   - permite tratar el seed como una sola unidad logica de trabajo
--   - deja explicito el punto exacto donde los cambios quedan persistidos
--
-- DESVENTAJAS / COSTOS:
--   - no reemplaza backups ni control de versiones
--   - no revierte DDL previo en MySQL como si fuera Git
--   - si siempre haces COMMIT automatico sin validacion, el beneficio operativo se reduce

-- ============================================================
-- 1) RESET DE ESTRUCTURA (DDL)
-- ============================================================
-- Orden de borrado: primero tablas hijas, luego padres, para respetar foreign keys.
-- Idea rapida:
--   - users y apps actuan como tablas padre
--   - user_apps y api_keys actuan como tablas hijas porque guardan FK hacia padres
--   - por eso se borran primero user_apps/api_keys y despues users/apps
-- Si intentas borrar primero una tabla padre mientras una hija aun la referencia,
-- MySQL normalmente bloqueara la operacion por integridad referencial.
-- El JOIN no crea la relacion; solo la consulta. La relacion real la crean las FOREIGN KEY.
DROP TABLE IF EXISTS user_apps;
DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS apps;

-- Tabla base de aplicaciones.
CREATE TABLE apps (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla base de usuarios.
CREATE TABLE users (
  id VARCHAR(32) PRIMARY KEY,
  username VARCHAR(64) NOT NULL,
  email VARCHAR(128) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL,
  scopes JSON NOT NULL,
  revoked_scopes JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla puente usuario-app con rol por aplicacion.
CREATE TABLE user_apps (
  user_id VARCHAR(32) NOT NULL,
  app_id  VARCHAR(32) NOT NULL,
  role    VARCHAR(32) NOT NULL,
  PRIMARY KEY (user_id, app_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (app_id)  REFERENCES apps(id)
);

-- API keys por aplicacion.
CREATE TABLE api_keys (
  id VARCHAR(32) PRIMARY KEY,
  app_id VARCHAR(32) NOT NULL,
  api_key VARCHAR(128) NOT NULL UNIQUE,
  scopes JSON NOT NULL,
  revoked TINYINT(1) NOT NULL DEFAULT 0,
  revoked_at TIMESTAMP NULL DEFAULT NULL,
  revoked_by VARCHAR(32) NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (app_id) REFERENCES apps(id)
);

-- ============================================================
-- 2) SEED DE DATOS (DML) PROTEGIDO CON TRANSACCION
-- ============================================================
START TRANSACTION;

-- APPS: registros base para que user_apps y api_keys tengan FK validas.
INSERT INTO apps (id, name, description)
VALUES
  ('app1', 'Catalogos',      'Gestion de catalogos'),
  ('app2', 'Notificaciones', 'Gestion de notificaciones');

-- USERS: usuarios base de desarrollo.
INSERT INTO users (id, username, email, password_hash, role, scopes, revoked_scopes)
VALUES
  ('f1a2b3c4d5e6f701', 'jorge',  'jorge',              '$2b$10$2G0kHBfFZn9b12KScl2O6uVgoa6e7nEfmjKeNW20mX93STr141kpC', 'admin',  JSON_ARRAY('*'), JSON_ARRAY()),
  ('f1a2b3c4d5e6f702', 'editor', 'editor@example.com', '$2b$10$SapQr9.kA5nF1uahd72iReYx8wEt918JfqfPXD1gnrASZrc/0csM.', 'editor', JSON_ARRAY(),    JSON_ARRAY()),
  ('f1a2b3c4d5e6f703', 'user',   'user@example.com',   '$2b$10$bm/A51eFWOLsHkxEuXPyR.TufvgWKHa9DRo7WfoxVpZEOrITZ/fJ6', 'user',   JSON_ARRAY(),    JSON_ARRAY());

-- USER_APPS: acceso por aplicacion y rol.
INSERT INTO user_apps (user_id, app_id, role)
VALUES
  ('f1a2b3c4d5e6f701', 'app1', 'admin'),
  ('f1a2b3c4d5e6f701', 'app2', 'admin'),
  ('f1a2b3c4d5e6f702', 'app1', 'editor'),
  ('f1a2b3c4d5e6f703', 'app1', 'user');

-- API_KEYS: keys base para pruebas app-to-app.
INSERT INTO api_keys (id, app_id, api_key, scopes)
VALUES
  ('k1', 'app1', 'app1_dev_key_2026', JSON_ARRAY('app1:read:users', 'app1:write:catalogs', 'app1:read:catalogs')),
  ('k2', 'app2', 'app2_dev_key_2026', JSON_ARRAY('app2:read:users', 'app2:read:catalogs'));

-- Si llegaste hasta aqui sin errores, el seed queda persistido.
COMMIT;

-- ============================================================
-- 3) VERIFICACION RAPIDA POST-BOOTSTRAP
-- ============================================================
SELECT id, username, email, role FROM users ORDER BY id;
SELECT id, name FROM apps ORDER BY id;
SELECT user_id, app_id, role FROM user_apps ORDER BY user_id, app_id;
SELECT id, app_id, api_key FROM api_keys ORDER BY id;

-- Relaciones con JOIN: asi ves como user_apps conecta users con apps.
SELECT
  u.id       AS user_id,
  u.username AS username,
  a.id       AS app_id,
  a.name     AS app_name,
  ua.role    AS app_role
FROM user_apps ua
JOIN users u ON u.id = ua.user_id
JOIN apps a ON a.id = ua.app_id
ORDER BY u.username, a.name;

-- JOIN entre apps y sus api_keys.
SELECT
  a.id      AS app_id,
  a.name    AS app_name,
  k.id      AS api_key_id,
  k.api_key AS api_key,
  k.revoked AS revoked
FROM api_keys k
JOIN apps a ON a.id = k.app_id
ORDER BY a.name, k.id;

-- ============================================================
-- 4) RUPTURA CONTROLADA (SOLO DESARROLLO)
-- ============================================================
-- Nota: estos queries estan comentados para ejecutarse manualmente cuando quieras probar fallos.
-- Nota: al terminar pruebas, puedes restaurar estado limpio re-ejecutando este archivo completo.

-- 4.1 Cambiar un campo simple (email)
-- UPDATE users SET email = 'jorge+debug@example.com' WHERE id = 'f1a2b3c4d5e6f701';

-- 4.2 Cambiar password_hash de un usuario (requiere hash bcrypt valido)
-- UPDATE users
-- SET password_hash = '$2b$10$REEMPLAZAR_HASH_VALIDO'
-- WHERE id = 'f1a2b3c4d5e6f701';

-- 4.3 Cambiar ID de usuario (requiere actualizar FK en user_apps)
-- START TRANSACTION;
-- UPDATE user_apps SET user_id = 'f1a2b3c4d5e6f999' WHERE user_id = 'f1a2b3c4d5e6f701';
-- UPDATE users SET id = 'f1a2b3c4d5e6f999' WHERE id = 'f1a2b3c4d5e6f701';
-- COMMIT;

-- 4.4 Eliminar una columna para simular desalineacion de schema
-- ALTER TABLE users DROP COLUMN revoked_scopes;
-- (esperado: algunos endpoints de escritura pueden fallar por columna faltante)

-- 4.5 Eliminar un usuario especifico
-- Primero se eliminan sus filas hijas en user_apps y luego la fila padre en users.
-- DELETE FROM user_apps WHERE user_id = 'f1a2b3c4d5e6f703';
-- DELETE FROM users WHERE id = 'f1a2b3c4d5e6f703';

-- 4.6 Ver dependencias con JOIN antes de borrar
-- SELECT u.username, ua.app_id, ua.role
-- FROM users u
-- LEFT JOIN user_apps ua ON ua.user_id = u.id
-- WHERE u.id = 'f1a2b3c4d5e6f703';

-- 4.7 Alternativa automatica a nivel MySQL para borrado de FILAS: ON DELETE CASCADE
-- Ejemplo conceptual en una FK:
-- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- Si existiera esa opcion, borrar un users.id eliminaria automaticamente sus filas hijas.
-- Ojo: eso aplica a DELETE de datos, no a DROP TABLE del schema.

-- ============================================================
-- 5) TROUBLESHOOTING DE PASSWORD HASH (FUERA DE MYSQL)
-- ============================================================
-- Importante: bcrypt no se puede "desencriptar" ni decodificar a texto plano.
-- Solo se puede comparar password plano contra hash.
-- Si el compare te da false en Bash/Linux, revisa primero las comillas:
--   usa comillas simples alrededor del script de node para que Bash no expanda los $ del hash.
--   (comprobado en esta sesion: doble comilla => false, comilla simple => true)

-- Generar hash bcrypt (Linux/WSL):
-- node -e 'const b=require("bcrypt"); b.hash("nueva_password",10).then(console.log)'

-- Verificar password vs hash (patron que suele fallar en Bash por expansion de $):
-- node -e "const b=require('bcrypt'); const p='nueva_password'; const h='$2b$10$...'; b.compare(p,h).then(console.log)"

-- Verificar password vs hash (version segura para Bash, recomendada):
-- node -e 'const b=require("bcrypt"); const p="nueva_password"; const h="$2b$10$esyRDhY1MJaSpzYFm3CGaOq4rEJneW1p1quIAc/mclcuCb3gR3YY6"; b.compare(p,h).then(console.log)'

-- Alternativa si quieres usar comillas dobles externas: escapa cada $ del hash
-- node -e "const b=require('bcrypt'); const p='nueva_password'; const h='\$2b\$10\$esyRDhY1MJaSpzYFm3CGaOq4rEJneW1p1quIAc/mclcuCb3gR3YY6'; b.compare(p,h).then(console.log)"

-- Recuperar password original no es posible con bcrypt.
-- Flujo correcto en produccion:
--   1) usuario solicita recuperacion por email o SMS
--   2) backend genera token aleatorio de un solo uso con expiracion corta
--   3) backend guarda solo el hash del token o un token firmado, nunca el password original
--   4) usuario abre enlace / ingresa codigo
--   5) backend valida token, expiracion y uso previo
--   6) backend permite definir una password nueva
--   7) backend guarda nuevo password_hash y revoca el token
-- Con bcrypt no se envia la password anterior; se reemplaza por una nueva.
-- ============================================================
-- 6) RESTORE RAPIDO (SOLO DESARROLLO)
-- ============================================================
-- Objetivo: volver rapido al estado base despues de pruebas de ruptura.

-- 6.1 Restore total (recomendado)
-- Ejecuta nuevamente este archivo completo desde el inicio.
-- Esto recrea esquema y resembra datos base en orden correcto.

-- 6.2 Restore parcial de usuario (cuando NO quieres resetear todo)
-- Caso A: el usuario existe pero quedo alterado
-- UPDATE users
-- SET
--   username = 'jorge',
--   email = 'jorge',
--   password_hash = '$2b$10$2G0kHBfFZn9b12KScl2O6uVgoa6e7nEfmjKeNW20mX93STr141kpC',
--   role = 'admin',
--   scopes = JSON_ARRAY('*'),
--   revoked_scopes = JSON_ARRAY()
-- WHERE id = 'f1a2b3c4d5e6f701';

-- Caso B: el usuario fue eliminado
-- INSERT INTO users (id, username, email, password_hash, role, scopes, revoked_scopes)
-- VALUES ('f1a2b3c4d5e6f701', 'jorge', 'jorge', '$2b$10$2G0kHBfFZn9b12KScl2O6uVgoa6e7nEfmjKeNW20mX93STr141kpC', 'admin', JSON_ARRAY('*'), JSON_ARRAY());

-- Restaurar relaciones user_apps esperadas para ese usuario
-- INSERT IGNORE INTO user_apps (user_id, app_id, role)
-- VALUES
--   ('f1a2b3c4d5e6f701', 'app1', 'admin'),
--   ('f1a2b3c4d5e6f701', 'app2', 'admin');

-- 6.3 Restore parcial de app y api_key
-- Caso A: restaurar app2 si fue eliminada o alterada
-- INSERT INTO apps (id, name, description)
-- VALUES ('app2', 'Notificaciones', 'Gestion de notificaciones')
-- ON DUPLICATE KEY UPDATE
--   name = VALUES(name),
--   description = VALUES(description);

-- Caso B: restaurar api key de app2
-- INSERT INTO api_keys (id, app_id, api_key, scopes)
-- VALUES ('k2', 'app2', 'app2_dev_key_2026', JSON_ARRAY('app2:read:users', 'app2:read:catalogs'))
-- ON DUPLICATE KEY UPDATE
--   app_id = VALUES(app_id),
--   api_key = VALUES(api_key),
--   scopes = VALUES(scopes),
--   revoked = 0,
--   revoked_at = NULL,
--   revoked_by = NULL;

-- Validacion minima posterior al restore parcial
-- SELECT id, username, email, role FROM users WHERE id = 'f1a2b3c4d5e6f701';
-- SELECT user_id, app_id, role FROM user_apps WHERE user_id = 'f1a2b3c4d5e6f701' ORDER BY app_id;
-- SELECT a.id, a.name, k.id, k.api_key, k.revoked
-- FROM apps a
-- LEFT JOIN api_keys k ON k.app_id = a.id
-- WHERE a.id = 'app2';
