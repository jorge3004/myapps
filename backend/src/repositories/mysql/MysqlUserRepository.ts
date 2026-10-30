import pool from '../../db';
import { User } from '../../models/user';
import { AppRole, IUserRepository, RegisteredUser } from '../userRepository';

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

export class MysqlUserRepository implements IUserRepository {
    async register(user: User, appRoles: AppRole[] = []): Promise<RegisteredUser> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.execute(
                `INSERT INTO users (id, username, email, password_hash, role, scopes, revoked_scopes)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    user.id,
                    user.username,
                    user.email,
                    user.passwordHash,
                    user.role,
                    JSON.stringify(user.scopes || []),
                    JSON.stringify(user.revokedScopes || [])
                ]
            );

            for (const appRole of appRoles) {
                await connection.execute(
                    `INSERT INTO user_apps (user_id, app_id, role)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE role = VALUES(role)`,
                    [user.id, appRole.appId, appRole.role]
                );
            }

            await connection.commit();
            return {
                ...user,
                appIds: appRoles.map((item) => item.appId),
                rolesPorApp: appRoles.reduce((acc: Record<string, string>, item) => {
                    acc[item.appId] = item.role;
                    return acc;
                }, {})
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    getUserById(id: string): Promise<User | null> {
        return this.fetchOneBy('id', id);
    }

    getUserByEmail(email: string): Promise<User | null> {
        return this.fetchOneBy('email', email);
    }

    getUserByUsername(username: string): Promise<User | null> {
        return this.fetchOneBy('username', username);
    }

    async listAllUsers(): Promise<User[]> {
        const [rows]: any = await pool.execute('SELECT * FROM users LIMIT ? OFFSET ?', [1000, 0]);
        return (rows || []).map(mapUserRow);
    }

    async updateUserScopes(id: string, scopes: string[], revokedScopes: string[]): Promise<void> {
        await pool.execute(
            'UPDATE users SET scopes = ?, revoked_scopes = ? WHERE id = ?',
            [JSON.stringify(scopes || []), JSON.stringify(revokedScopes || []), id]
        );
    }

    private async fetchOneBy(column: 'id' | 'email' | 'username', value: string): Promise<User | null> {
        const [rows]: any = await pool.execute(`SELECT * FROM users WHERE ${column} = ?`, [value]);
        return rows[0] ? mapUserRow(rows[0]) : null;
    }

    async getUserAppRoles(userId: string): Promise<AppRole[]> {
        const [rows]: any = await pool.execute(
            'SELECT app_id, role FROM user_apps WHERE user_id = ?',
            [userId]
        );
        return (rows || []).map((row: any) => ({ appId: row.app_id, role: row.role }));
    }

    async upsertUserAppRole(userId: string, appId: string, role: string): Promise<void> {
        await pool.execute(
            `INSERT INTO user_apps (user_id, app_id, role)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE role = VALUES(role)`,
            [userId, appId, role]
        );
    }

    async removeUserAppRole(userId: string, appId: string): Promise<void> {
        await pool.execute(
            'DELETE FROM user_apps WHERE user_id = ? AND app_id = ?',
            [userId, appId]
        );
    }
}
