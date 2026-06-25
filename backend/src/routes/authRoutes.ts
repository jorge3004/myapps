
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../services/userService';
import { User } from '../models/user';
import { buildUserAuthorizationContext, canAccessApp, resolveRoleForApp } from '../services/authorizationService';
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
        const authzContext = buildUserAuthorizationContext(user, appRoles);

        // Admin global puede entrar sin appId
        if (authzContext.isGlobalAdmin && !appId) {
            const payload = {
                type: 'user',
                userId: user.id,
                username: user.username,
                appId: '*',
                role: 'admin',
                appIds: authzContext.allowedAppIds,
                rolesPorApp: authzContext.rolesPorApp,
                scopes: authzContext.effectiveScopes
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
            return res.json({ token });
        }

        if (!appId) {
            return res.status(400).json({ error: 'appId required for non-admin users' });
        }

        if (!canAccessApp(authzContext, appId)) {
            return res.status(403).json({ error: 'User does not have access to this app' });
        }

        const role = resolveRoleForApp(authzContext, appId);
        const payload = {
            type: 'user',
            userId: user.id,
            username: user.username,
            appId,
            role,
            appIds: authzContext.allowedAppIds,
            rolesPorApp: authzContext.rolesPorApp,
            scopes: authzContext.effectiveScopes
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        res.json({ token });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
