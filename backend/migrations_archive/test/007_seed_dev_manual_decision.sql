-- Seed de desarrollo (modo decision manual)
-- Ejecutar con SOURCE y luego decidir en consola: COMMIT o ROLLBACK.
-- Importante: no cierres la sesion mysql antes de decidir.

START TRANSACTION;

-- 1) APPS
INSERT INTO apps (id, name, description)
VALUES
  ('app1', 'Catalogos',      'Gestion de catalogos'),
  ('app2', 'Notificaciones', 'Gestion de notificaciones')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

-- 2) USERS
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
  )
ON DUPLICATE KEY UPDATE
  username = VALUES(username),
  email = VALUES(email),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  scopes = VALUES(scopes),
  revoked_scopes = VALUES(revoked_scopes);

-- 3) USER_APPS
INSERT INTO user_apps (user_id, app_id, role)
VALUES
  ('f1a2b3c4d5e6f701', 'app1', 'admin'),
  ('f1a2b3c4d5e6f701', 'app2', 'admin'),
  ('f1a2b3c4d5e6f702', 'app1', 'editor'),
  ('f1a2b3c4d5e6f703', 'app1', 'user')
ON DUPLICATE KEY UPDATE
  role = VALUES(role);

-- 4) API_KEYS
INSERT INTO api_keys (id, app_id, api_key, scopes)
VALUES
  ('k1', 'app1', 'app1_dev_key_2026', JSON_ARRAY('app1:read:users', 'app1:write:catalogs', 'app1:read:catalogs')),
  ('k2', 'app2', 'app2_dev_key_2026', JSON_ARRAY('app2:read:users', 'app2:read:catalogs'))
ON DUPLICATE KEY UPDATE
  api_key = VALUES(api_key),
  scopes = VALUES(scopes);

-- Verificacion antes de decidir
SELECT id, username, email, role FROM users ORDER BY id;
SELECT id, name FROM apps ORDER BY id;
SELECT user_id, app_id, role FROM user_apps ORDER BY user_id, app_id;
SELECT id, app_id, api_key FROM api_keys ORDER BY id;

-- DECISION MANUAL EN CONSOLA (misma sesion):
-- COMMIT;
-- o
-- ROLLBACK;
