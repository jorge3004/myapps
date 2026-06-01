// User model and MySQL functions (TypeScript)
import pool from '../db';

export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    role: string;
    scopes?: string[];
    revokedScopes?: string[];
}

function parseJsonArray(value: unknown): string[] {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
}

function mapUserRow(row: any): User {
    return {
        id: row.id,
        username: row.username,
        email: row.email,
        passwordHash: row.passwordHash || row.password_hash,
        role: row.role,
        scopes: parseJsonArray(row.scopes),
        revokedScopes: parseJsonArray(row.revokedScopes || row.revoked_scopes)
    };
}

export async function createUser({ id, username, email, passwordHash, role, scopes, revokedScopes }: User) {
    const [result] = await pool.execute(
        `INSERT INTO users (id, username, email, password_hash, role, scopes, revoked_scopes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, username, email, passwordHash, role, JSON.stringify(scopes || []), JSON.stringify(revokedScopes || [])]
    );
    return result;
}

export async function getUserById(id: string): Promise<User | null> {
    const [rows]: any = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    return rows[0] ? mapUserRow(rows[0]) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const [rows]: any = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows[0] ? mapUserRow(rows[0]) : null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
    const [rows]: any = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    return rows[0] ? mapUserRow(rows[0]) : null;
}

export async function listUsers({ limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}): Promise<User[]> {
    const [rows]: any = await pool.execute(
        'SELECT * FROM users LIMIT ? OFFSET ?',
        [limit, offset]
    );
    return (rows || []).map(mapUserRow);
}

export async function updateUserScopes(id: string, scopes: string[], revokedScopes: string[]): Promise<any> {
    const [result] = await pool.execute(
        `UPDATE users SET scopes = ?, revoked_scopes = ? WHERE id = ?`,
        [JSON.stringify(scopes || []), JSON.stringify(revokedScopes || []), id]
    );
    return result;
}
