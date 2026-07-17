-- Migration: Create user_apps table for MySQL
-- Fecha: 2026-05-29
-- Base de datos: jirdcom_myapps
--
-- DISEÑO:
--   Tabla puente entre users y apps.
--   Define qué apps puede acceder cada usuario y con qué rol.
--
--   Por qué un rol por app y no un rol global:
--     Un usuario puede ser 'admin' en la app de Catálogos pero solo 'user' en Notificaciones.
--     Los scopes del JWT se derivan de esta tabla: authRoutes.ts llama getUserAppRoles(),
--     aplica el mapa ROLE_SCOPES por cada app y construye el payload del token.
--
--   role: debe coincidir con las claves de ROLE_SCOPES en authRoutes.ts
--         ('admin' | 'editor' | 'user')

CREATE TABLE IF NOT EXISTS user_apps (
  user_id VARCHAR(32) NOT NULL,
  app_id  VARCHAR(32) NOT NULL,
  role    VARCHAR(32) NOT NULL,
  PRIMARY KEY (user_id, app_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (app_id)  REFERENCES apps(id)
);
