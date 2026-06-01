-- Migration: Create users table for MySQL
-- Fecha: 2026-05-29
--
-- CONVENCIONES DE DISEÑO:
--   - id: VARCHAR(32), generado con crypto.randomUUID() truncado (no auto-increment)
--     para que los IDs sean portables entre ambientes sin coordinación de secuencias.
--   - password_hash: bcrypt cost 10. El salt va embebido en el hash (columna salt separada
--     es innecesaria con bcrypt). JWT_SECRET NO se usa para hashear passwords.
--   - scopes / revoked_scopes: JSON array. Se derivan en authRoutes.ts a partir del rol
--     del usuario en cada app (tabla user_apps + mapa ROLE_SCOPES).
--   - Nombres de columnas: snake_case en DB → mapeados a camelCase en JS por mapUserRow()
--     en models/user.ts.
CREATE TABLE IF NOT EXISTS users (
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
