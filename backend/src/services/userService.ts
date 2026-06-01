// userService.ts - MySQL-backed user service (TypeScript)
import * as userModel from '../models/user';
import { User } from '../models/user';
import pool from '../db';

export const USER_DATA_SOURCE = 'mysql';

export async function register(user: User, appRoles: Array<{ appId: string; role: string }> = []) {
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

export async function getUserById(id: string): Promise<User | null> {
    return userModel.getUserById(id);
}

export async function getUserByEmail(email: string): Promise<User | null> {
    return userModel.getUserByEmail(email);
}

export async function getUserByUsername(username: string): Promise<User | null> {
    return userModel.getUserByUsername(username);
}

export async function listAllUsers(): Promise<User[]> {
    return userModel.listUsers({ limit: 1000, offset: 0 });
}

export async function update(id: string, fields: Partial<User>) {
    // Only allow updating scopes and revokedScopes for now
    return userModel.updateUserScopes(id, fields.scopes || [], fields.revokedScopes || []);
}

export async function getUserAppRoles(userId: string): Promise<Array<{ appId: string; role: string }>> {
    const [rows]: any = await pool.execute(
        'SELECT app_id, role FROM user_apps WHERE user_id = ?',
        [userId]
    );
    return (rows || []).map((row: any) => ({ appId: row.app_id, role: row.role }));
}

export function getUserDataSource(): string {
    return USER_DATA_SOURCE;
}
