
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../services/userService';
import { User } from '../models/user';

// Centralized role-to-scope mapping used by MySQL-backed auth
export const ROLE_SCOPES: Record<string, string[]> = {
    'admin': ['*'],
    'user': ['read:users', 'read:catalogs'],
    'editor': ['read:users', 'write:catalogs'],
};

export function deriveScopes(user: User, rolesPorApp: Record<string, string>, appIds: string[]): string[] {
    const scopes = new Set<string>();
    // 1. Scopes derivados de role por app
    for (const appId of appIds) {
        const role = rolesPorApp[appId];
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

    // 2. Scopes directos en users.scopes
    if (user.scopes && Array.isArray(user.scopes)) {
        for (const s of user.scopes) {
            scopes.add(s);
        }
    }

    // 3. Revoked scopes explícitos
    if (user.revokedScopes && Array.isArray(user.revokedScopes)) {
        for (const revoked of user.revokedScopes) {
            scopes.delete(revoked);
        }
    }

    return Array.from(scopes);
}
import bcrypt from 'bcrypt';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const TOKEN_EXPIRATION = '1h';

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password, appId } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        const user: User | null = await userService.getUserByUsername(username) || await userService.getUserByEmail(username);
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const appRoles = await userService.getUserAppRoles(user.id);
        const allowedAppIds = appRoles.map((row) => row.appId);
        const rolesPorApp = appRoles.reduce((acc: Record<string, string>, row) => {
            acc[row.appId] = row.role;
            return acc;
        }, {});

        const isGlobalAdmin = user.role === 'admin';

        // Admin global puede entrar sin appId
        if (isGlobalAdmin && !appId) {
            const payload = {
                type: 'user',
                userId: user.id,
                username: user.username,
                appId: '*',
                role: 'admin',
                appIds: allowedAppIds,
                rolesPorApp,
                scopes: deriveScopes(user, rolesPorApp, allowedAppIds)
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
            return res.json({ token });
        }

        if (!appId) {
            return res.status(400).json({ error: 'appId required for non-admin users' });
        }

        const hasAccess = isGlobalAdmin || allowedAppIds.includes(appId);
        if (!hasAccess) {
            return res.status(403).json({ error: 'User does not have access to this app' });
        }

        const role = isGlobalAdmin ? 'admin' : (rolesPorApp[appId] || 'user');
        const payload = {
            type: 'user',
            userId: user.id,
            username: user.username,
            appId,
            role,
            appIds: allowedAppIds,
            rolesPorApp,
            scopes: deriveScopes(user, rolesPorApp, allowedAppIds)
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        res.json({ token });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
