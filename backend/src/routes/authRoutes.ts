
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from 'user-management';
import { User } from 'user-management/dist/adapters/IUserRepository';

// Centralized role-to-scope mapping (should match user-management)
export const ROLE_SCOPES: Record<string, string[]> = {
    'admin': ['*'],
    'user': ['read:users', 'read:catalogs'],
    'editor': ['read:users', 'write:catalogs'],
};

export function deriveScopes(user: User): string[] {
    const scopes = new Set<string>();
    // 1. From rolesPorApp
    if (user.rolesPorApp && user.appIds) {
        for (const appId of user.appIds) {
            const role = user.rolesPorApp[appId] || user.rolesPorApp['*'];
            if (role && ROLE_SCOPES[role]) {
                for (const scope of ROLE_SCOPES[role]) {
                    if (scope === '*') {
                        scopes.add('*');
                    } else {
                        scopes.add(`${appId}:${scope}`);
                    }
                }
            }
        }
    }
    // 2. Add direct user scopes (if any)
    if (user.scopes && Array.isArray(user.scopes)) {
        for (const s of user.scopes) {
            scopes.add(s);
        }
    }
    return Array.from(scopes);
}
import bcrypt from 'bcrypt';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const TOKEN_EXPIRATION = '1h';

// Usuario admin fijo en memoria
// username: "jorge" (name y email)
const adminUser = {
    id: '1',
    email: 'jorge', // username
    name: 'jorge', // username
    passwordHash: 'jorge123', // Solo para pruebas, en real usar hash seguro
    appIds: ['*'], // '*' significa acceso a todas las apps
    rolesPorApp: { '*': 'admin' } // admin global
};

// Inicializar usuario admin en memoria si no existe
(async () => {
    const existing = await userService.getUserByEmail(adminUser.email);
    if (!existing) {
        await userService.register(adminUser);
    }
})();

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password, appId } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        // Buscar usuario por username (en este modelo, username == name)
        const user: User | null = await userService.getUserByUsername
            ? await userService.getUserByUsername(username)
            : await userService.getUserByEmail(username);
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const allowedAppIds = user.appIds || [];
        // Si el usuario es admin global ('*'), permitir login sin appId
        if (allowedAppIds.includes('*')) {
            const rolesPorApp = user.rolesPorApp || {};
            const role = rolesPorApp['*'] || 'admin';
            const payload = {
                type: 'user',
                userId: user.id,
                username: user.name,
                appId: '*',
                role,
                appIds: allowedAppIds,
                rolesPorApp,
                scopes: deriveScopes(user)
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
            return res.json({ token });
        }
        // Para usuarios normales, exigir appId
        if (!appId) {
            return res.status(400).json({ error: 'appId required for non-admin users' });
        }
        const hasAccess = allowedAppIds.includes(appId);
        if (!hasAccess) {
            return res.status(403).json({ error: 'User does not have access to this app' });
        }
        const rolesPorApp = user.rolesPorApp || {};
        const role = rolesPorApp[appId] || 'user';
        const payload = {
            type: 'user',
            userId: user.id,
            username: user.name,
            appId,
            role,
            appIds: allowedAppIds,
            rolesPorApp,
            scopes: deriveScopes(user)
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        res.json({ token });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
