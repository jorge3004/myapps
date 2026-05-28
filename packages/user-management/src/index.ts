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

const adminUser: User = {
    id: '1',
    email: 'jorge',
    name: 'jorge',
    passwordHash: bcrypt.hashSync('jorge123', 10),
    appIds: ['*'],
    rolesPorApp: { '*': 'admin' }
    // scopes: [] // Solo agregar si hay excepciones
};
userRepo.create(adminUser);

// Usuario test de ejemplo
const testUser: User = {
    id: '2',
    email: 'test',
    name: 'test',
    passwordHash: bcrypt.hashSync('test123', 10),
    appIds: ['ratw3urj'],
    rolesPorApp: { 'ratw3urj': 'user' }
    // scopes: []
};
userRepo.create(testUser);

// Usuario editor de ejemplo
const editorUser: User = {
    id: '3',
    email: 'editor',
    name: 'editor',
    passwordHash: bcrypt.hashSync('editor123', 10),
    appIds: ['ratw3urj'],
    rolesPorApp: { 'ratw3urj': 'editor' },
    // scopes: ['ratw3urj:edit:product'], // Puedes agregarlo manualmente vía endpoint
    revokedScopes: ['ratw3urj:write:catalogs']
};
userRepo.create(editorUser);

// Así podrías exponer otros servicios o controladores
