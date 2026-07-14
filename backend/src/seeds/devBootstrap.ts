import { ApiKey, App } from '../models/app';
import { User } from '../models/user';
import { AppRole } from '../repositories/userRepository';

export interface SeedUser extends User {
    appRoles: AppRole[];
}

export interface SeedApp extends App {
    apiKeys: ApiKey[];
}

export const DEV_SEED_USERS: SeedUser[] = [
    {
        id: 'f1a2b3c4d5e6f701',
        username: 'jorge',
        email: 'jorge',
        passwordHash: '$2b$10$2G0kHBfFZn9b12KScl2O6uVgoa6e7nEfmjKeNW20mX93STr141kpC',
        role: 'admin',
        scopes: ['*'],
        revokedScopes: [],
        appRoles: [
            { appId: 'app1', role: 'admin' },
            { appId: 'app2', role: 'admin' }
        ]
    },
    {
        id: 'f1a2b3c4d5e6f702',
        username: 'editor',
        email: 'editor@example.com',
        passwordHash: '$2b$10$SapQr9.kA5nF1uahd72iReYx8wEt918JfqfPXD1gnrASZrc/0csM.',
        role: 'editor',
        scopes: [],
        revokedScopes: [],
        appRoles: [{ appId: 'app1', role: 'editor' }]
    },
    {
        id: 'f1a2b3c4d5e6f703',
        username: 'user',
        email: 'user@example.com',
        passwordHash: '$2b$10$bm/A51eFWOLsHkxEuXPyR.TufvgWKHa9DRo7WfoxVpZEOrITZ/fJ6',
        role: 'user',
        scopes: [],
        revokedScopes: [],
        appRoles: [{ appId: 'app1', role: 'user' }]
    }
];

export const DEV_SEED_APPS: SeedApp[] = [
    {
        id: 'app1',
        name: 'Catalogos',
        description: 'Gestion de catalogos',
        createdAt: '2026-06-01T00:00:00.000Z',
        apiKeys: [
            {
                id: 'k1',
                appId: 'app1',
                apiKey: 'app1_dev_key_2026',
                scopes: ['app1:read:users', 'app1:write:catalogs', 'app1:read:catalogs'],
                revoked: false,
                revokedAt: null,
                revokedBy: null,
                createdAt: '2026-06-01T00:00:00.000Z'
            }
        ]
    },
    {
        id: 'app2',
        name: 'Notificaciones',
        description: 'Gestion de notificaciones',
        createdAt: '2026-06-01T00:00:00.000Z',
        apiKeys: [
            {
                id: 'k2',
                appId: 'app2',
                apiKey: 'app2_dev_key_2026',
                scopes: ['app2:read:users', 'app2:read:catalogs'],
                revoked: false,
                revokedAt: null,
                revokedBy: null,
                createdAt: '2026-06-01T00:00:00.000Z'
            }
        ]
    }
];