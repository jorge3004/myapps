-- Migration: Create apps and api_keys tables for MySQL
-- Fecha: 2026-06-01
-- Base de datos: jirdcom_myapps
--
-- DISEÑO:
--   apps:
--     Representa cada aplicación registrada en el sistema (catalog, notificaciones, etc.).
--     id generado con crypto.randomUUID() truncado, igual que users.
--
--   api_keys:
--     Una app puede tener múltiples API keys (rotación sin downtime).
--     scopes: JSON array con los permisos de la key (e.g. ['app1:read:users']).
--     revoked / revoked_at / revoked_by: soporte para revocación auditada.
--       - revoked = 0/1 (TINYINT, no BOOLEAN, para compatibilidad MySQL 5.x).
--       - revoked_by referencia el userId del usuario que revocó (no FK para flexibilidad).
--     NOTA SEGURIDAD: en producción guardar hash de la API key, no el valor en texto plano.
--
-- Si la tabla api_keys ya existe sin las columnas de revocación, ejecutar:
--   ALTER TABLE api_keys
--     ADD COLUMN revoked     TINYINT(1) NOT NULL DEFAULT 0,
--     ADD COLUMN revoked_at  TIMESTAMP NULL DEFAULT NULL,
--     ADD COLUMN revoked_by  VARCHAR(32) NULL DEFAULT NULL;

CREATE TABLE IF NOT EXISTS apps (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_keys (
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
