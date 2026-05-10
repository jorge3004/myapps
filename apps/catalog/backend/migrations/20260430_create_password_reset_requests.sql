-- Migration: create password_reset_requests table

CREATE TABLE IF NOT EXISTS password_reset_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, completed
    requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    completed_at TIMESTAMP,
    admin_id INTEGER REFERENCES users(id), -- admin que aprueba/rechaza
    reason TEXT
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset_requests(user_id);