import { UserService } from './services/UserService';
import { InMemoryUserRepository } from './adapters/InMemoryUserRepository';
import bcrypt from 'bcrypt';
import { User } from './adapters/IUserRepository';

// Ejemplo de inicialización del módulo

const userRepo = new InMemoryUserRepository();
export const userService = new UserService(userRepo);

// Usuarios iniciales estandarizados con backend/migrations/20260601_seed_dev.sql
const adminUser: User = {
    id: 'f1a2b3c4d5e6f701',
    email: 'jorge',
    name: 'jorge',
    passwordHash: bcrypt.hashSync('jorge123', 10),
    appIds: ['app1', 'app2'],
    rolesPorApp: { app1: 'admin', app2: 'admin' },
    scopes: ['*'],
    revokedScopes: []
};
userRepo.create(adminUser);

const editorUser: User = {
    id: 'f1a2b3c4d5e6f702',
    email: 'editor',
    name: 'editor',
    passwordHash: bcrypt.hashSync('editor123', 10),
    appIds: ['app1'],
    rolesPorApp: { app1: 'editor' },
    revokedScopes: []
};
userRepo.create(editorUser);

const userBase: User = {
    id: 'f1a2b3c4d5e6f703',
    email: 'user',
    name: 'user',
    passwordHash: bcrypt.hashSync('user123', 10),
    appIds: ['app1'],
    rolesPorApp: { app1: 'user' },
    revokedScopes: []
};
userRepo.create(userBase);

// Así podrías exponer otros servicios o controladores
