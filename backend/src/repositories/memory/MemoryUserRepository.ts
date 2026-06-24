import { User } from '../../models/user';
import { AppRole, IUserRepository, RegisteredUser } from '../userRepository';

const users = new Map<string, User>();
const userApps = new Map<string, AppRole[]>();

function cloneUser(user: User): User {
    return {
        ...user,
        scopes: [...(user.scopes || [])],
        revokedScopes: [...(user.revokedScopes || [])]
    };
}

export class MemoryUserRepository implements IUserRepository {
    async register(user: User, appRoles: AppRole[] = []): Promise<RegisteredUser> {
        users.set(user.id, cloneUser(user));
        userApps.set(user.id, appRoles.map((role) => ({ ...role })));

        return {
            ...cloneUser(user),
            appIds: appRoles.map((item) => item.appId),
            rolesPorApp: appRoles.reduce((acc: Record<string, string>, item) => {
                acc[item.appId] = item.role;
                return acc;
            }, {})
        };
    }

    async getUserById(id: string): Promise<User | null> {
        const user = users.get(id);
        return user ? cloneUser(user) : null;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        for (const user of users.values()) {
            if (user.email === email) return cloneUser(user);
        }
        return null;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        for (const user of users.values()) {
            if (user.username === username) return cloneUser(user);
        }
        return null;
    }

    async listAllUsers(): Promise<User[]> {
        return Array.from(users.values()).map(cloneUser);
    }

    async updateUserScopes(id: string, scopes: string[], revokedScopes: string[]): Promise<void> {
        const user = users.get(id);
        if (!user) return;
        user.scopes = [...(scopes || [])];
        user.revokedScopes = [...(revokedScopes || [])];
        users.set(id, cloneUser(user));
    }

    async getUserAppRoles(userId: string): Promise<AppRole[]> {
        return (userApps.get(userId) || []).map((item) => ({ ...item }));
    }

    async upsertUserAppRole(userId: string, appId: string, role: string): Promise<void> {
        const existing = userApps.get(userId) || [];
        const current = existing.find((item) => item.appId === appId);
        if (current) {
            current.role = role;
        } else {
            existing.push({ appId, role });
        }
        userApps.set(userId, existing.map((item) => ({ ...item })));
    }

    async removeUserAppRole(userId: string, appId: string): Promise<void> {
        const existing = userApps.get(userId) || [];
        const filtered = existing.filter((item) => item.appId !== appId);
        userApps.set(userId, filtered.map((item) => ({ ...item })));
    }
}
