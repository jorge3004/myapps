import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import * as userService from '../services/userService';
import * as appService from '../services/appService';
import { logAudit } from '../audit/auditLog';
import { User } from '../models/user';
import { requireParam } from './helpers/requestParams';
import { toPublicUser } from './helpers/userResponse';

function getUserId(length = 16): string {
    return randomUUID().replace(/-/g, '').slice(0, length);
}

export const listUsers = async (req: Request, res: Response) => {
    try {
        // Paginación: ?limit=20&offset=0
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20));
        const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
        const allUsers = await userService.listAllUsers();
        const total = allUsers.length;
        const users = allUsers.slice(offset, offset + limit);
        return res.json({
            total,
            limit,
            offset,
            count: users.length,
            users: users.map(toPublicUser)
        });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};

export const getUserApps = async (req: Request, res: Response) => {
    try {
        const userId = requireParam(req, 'userId');
        const user: User | null = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const allApps = await appService.listApplications();
        const appRoles = await userService.getUserAppRoles(userId);
        const allowedAppIds = appRoles.map((row: { appId: string; role: string }) => row.appId);
        // '*' significa acceso a todas las apps
        const apps = allowedAppIds.includes('*')
            ? allApps
            : allApps.filter(app => allowedAppIds.includes(app.id));
        return res.json({ apps });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = requireParam(req, 'userId');
        const user: User | null = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'No encontrado' });
        return res.json(toPublicUser(user));
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        // Permitir username como alias de name
        let { id, email, name, username, password, appIds, rolesPorApp, role, scopes, revokedScopes } = req.body;
        if (!password || typeof password !== 'string' || password.length < 4) {
            return res.status(400).json({ error: 'Password is required and must be at least 4 characters.' });
        }
        const resolvedUsername = username || name || email;
        if (!resolvedUsername || typeof resolvedUsername !== 'string') {
            return res.status(400).json({ error: 'username is required' });
        }

        const userId = id || getUserId(16);
        const passwordHash = await bcrypt.hash(password, 10);
        const normalizedAppIds = Array.isArray(appIds) ? appIds.filter((appId: unknown) => typeof appId === 'string' && appId.trim()) : [];
        const normalizedRolesPorApp = rolesPorApp && typeof rolesPorApp === 'object' ? rolesPorApp : {};
        const appRoleEntries = normalizedAppIds.map((appId: string) => ({
            appId,
            role: typeof normalizedRolesPorApp[appId] === 'string' ? normalizedRolesPorApp[appId] : (role || 'user')
        }));
        const resolvedRole = typeof role === 'string'
            ? role
            : (appRoleEntries[0]?.role || 'user');
        const user: User = {
            id: userId,
            username: resolvedUsername,
            email: email || resolvedUsername,
            passwordHash,
            role: resolvedRole,
            scopes: Array.isArray(scopes) ? scopes : [],
            revokedScopes: Array.isArray(revokedScopes) ? revokedScopes : []
        };
        const created = await userService.register(user, appRoleEntries);

        // Auditoría: registrar creación de usuario
        const actor = req.user;
        logAudit({
            actorId: actor?.userId || 'unknown',
            action: 'create_user',
            targetType: 'user',
            targetId: userId,
            details: {
                email: user.email,
                username: user.username,
                appIds: normalizedAppIds,
                rolesPorApp: normalizedRolesPorApp
            }
        });

        return res.status(201).json(toPublicUser(created));
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};


export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const email = requireParam(req, 'email');
        const user: User | null = await userService.getUserByEmail(email);
        if (!user) return res.status(404).json({ error: 'No encontrado' });
        return res.json(toPublicUser(user));
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};

export const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const username = requireParam(req, 'username');
        const user: User | null = await userService.getUserByUsername(username);
        if (!user) return res.status(404).json({ error: 'No encontrado' });
        return res.json(toPublicUser(user));
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};
