// userService.ts - datasource-agnostic user service
import { User } from '../models/user';
import { AppRole } from '../repositories/userRepository';
import { getDataSource, getUserRepository } from '../repositories';

export async function register(user: User, appRoles: AppRole[] = []) {
    return getUserRepository().register(user, appRoles);
}

export async function getUserById(id: string): Promise<User | null> {
    return getUserRepository().getUserById(id);
}

export async function getUserByEmail(email: string): Promise<User | null> {
    return getUserRepository().getUserByEmail(email);
}

export async function getUserByUsername(username: string): Promise<User | null> {
    return getUserRepository().getUserByUsername(username);
}

export async function listAllUsers(): Promise<User[]> {
    return getUserRepository().listAllUsers();
}

export async function update(id: string, fields: Partial<User>) {
    await getUserRepository().updateUserScopes(id, fields.scopes || [], fields.revokedScopes || []);
}

export async function getUserAppRoles(userId: string): Promise<Array<{ appId: string; role: string }>> {
    return getUserRepository().getUserAppRoles(userId);
}

export async function assignUserToApp(userId: string, appId: string, role: string): Promise<void> {
    await getUserRepository().upsertUserAppRole(userId, appId, role);
}

export async function removeUserFromApp(userId: string, appId: string): Promise<void> {
    await getUserRepository().removeUserAppRole(userId, appId);
}

export function getUserDataSource(): string {
    return getDataSource();
}
