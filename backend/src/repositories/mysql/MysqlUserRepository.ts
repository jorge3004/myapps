import pool from '../../db';
import * as userModel from '../../models/user';
import { User } from '../../models/user';
import { AppRole, IUserRepository, RegisteredUser } from '../userRepository';

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
        return userModel.getUserById(id);
    }

    getUserByEmail(email: string): Promise<User | null> {
        return userModel.getUserByEmail(email);
    }

    getUserByUsername(username: string): Promise<User | null> {
        return userModel.getUserByUsername(username);
    }

    listAllUsers(): Promise<User[]> {
        return userModel.listUsers({ limit: 1000, offset: 0 });
    }

    async updateUserScopes(id: string, scopes: string[], revokedScopes: string[]): Promise<void> {
        await userModel.updateUserScopes(id, scopes, revokedScopes);
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
