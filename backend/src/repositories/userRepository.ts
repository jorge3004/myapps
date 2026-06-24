import { User } from '../models/user';

export interface AppRole {
    appId: string;
    role: string;
}

export interface RegisteredUser extends User {
    appIds: string[];
    rolesPorApp: Record<string, string>;
}

export interface IUserRepository {
    register(user: User, appRoles: AppRole[]): Promise<RegisteredUser>;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserByUsername(username: string): Promise<User | null>;
    listAllUsers(): Promise<User[]>;
    updateUserScopes(id: string, scopes: string[], revokedScopes: string[]): Promise<void>;
    getUserAppRoles(userId: string): Promise<AppRole[]>;
    upsertUserAppRole(userId: string, appId: string, role: string): Promise<void>;
    removeUserAppRole(userId: string, appId: string): Promise<void>;
}
