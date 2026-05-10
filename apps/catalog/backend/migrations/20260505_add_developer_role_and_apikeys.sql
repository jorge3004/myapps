-- 1. Agregar rol 'developer' a la tabla users (si es enum, agregar valor; si es string, solo usarlo)
-- 2. Crear tabla api_keys para gestión de llaves de desarrollador

-- Si role es ENUM, primero ALTER TYPE (ajustar según tu DB)
-- ALTER TYPE user_role ADD VALUE 'developer';

-- Tabla de API Keys
CREATE TABLE IF NOT EXISTS api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    api_key VARCHAR(64) NOT NULL UNIQUE,
    scopes TEXT NOT NULL, -- JSON string: '["read:users","read:catalogs"]'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT 0,
    revoked_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índice para búsqueda rápida
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
