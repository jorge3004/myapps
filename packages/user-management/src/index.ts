import { UserService } from './services/UserService';
import { InMemoryUserRepository } from './adapters/InMemoryUserRepository';

// Ejemplo de inicialización del módulo

const userRepo = new InMemoryUserRepository();
export const userService = new UserService(userRepo);

// Usuario admin de ejemplo (jorge)
import bcrypt from 'bcrypt';
import { User } from './adapters/IUserRepository';

// Mapeo estándar de roles a scopes
const ROLE_SCOPES: Record<string, string[]> = {
    'admin': ['*'],
    'user': ['read:users', 'read:catalogs'],
    'editor': ['read:users', 'write:catalogs'],
    // Agrega más roles y sus scopes aquí
};

function scopesFromRoles(rolesPorApp: { [appId: string]: string }, appIds: string[]): string[] {
    const scopes: Set<string> = new Set();
    for (const appId of appIds) {
        const role = rolesPorApp[appId] || rolesPorApp['*'];
        if (role && ROLE_SCOPES[role]) {
            for (const scope of ROLE_SCOPES[role]) {
                // Si el scope es '*', aplica global
                if (scope === '*') {
                    scopes.add('*');
                } else {
                    scopes.add(`${appId}:${scope}`);
                }
            }
        }
    }
    return Array.from(scopes);
}


// IDs fijos tipo NanoID para usuarios iniciales
const adminUser: User = {
    id: 'admin1234567890abcdef',
    email: 'jorge',
    name: 'jorge',
    passwordHash: bcrypt.hashSync('jorge123', 10),
    appIds: ['*'],
    rolesPorApp: { '*': 'admin' }
};
userRepo.create(adminUser);

const testUser: User = {
    id: 'test1234567890abcdefg',
    email: 'test',
    name: 'test',
    passwordHash: bcrypt.hashSync('test123', 10),
    appIds: ['ratw3urj'],
    rolesPorApp: { 'ratw3urj': 'user' }
};
userRepo.create(testUser);

const editorUser: User = {
    id: 'editor1234567890abcde',
    email: 'editor',
    name: 'editor',
    passwordHash: bcrypt.hashSync('editor123', 10),
    appIds: ['ratw3urj'],
    rolesPorApp: { 'ratw3urj': 'editor' },
    revokedScopes: ['ratw3urj:write:catalogs']
};
userRepo.create(editorUser);

// Así podrías exponer otros servicios o controladores
