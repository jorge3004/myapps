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
  (
    'f1a2b3c4d5e6f701', 'jorge', 'jorge',
    '$2b$10$2G0kHBfFZn9b12KScl2O6uVgoa6e7nEfmjKeNW20mX93STr141kpC',
    'admin', JSON_ARRAY('*'), JSON_ARRAY()
  ),
  (
    'f1a2b3c4d5e6f702', 'editor', 'editor@example.com',
    '$2b$10$SapQr9.kA5nF1uahd72iReYx8wEt918JfqfPXD1gnrASZrc/0csM.',
    'editor', JSON_ARRAY(), JSON_ARRAY()
  ),
  (
    'f1a2b3c4d5e6f703', 'user', 'user@example.com',
    '$2b$10$bm/A51eFWOLsHkxEuXPyR.TufvgWKHa9DRo7WfoxVpZEOrITZ/fJ6',
    'user', JSON_ARRAY(), JSON_ARRAY()
  );

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
