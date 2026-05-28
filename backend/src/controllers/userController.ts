// Añadir un scope directo al usuario
export const addUserScope = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { scope } = req.body;
        if (!scope || typeof scope !== 'string') return res.status(400).json({ error: 'Scope required' });
        // Validar patrón <appId>:<action>:<resource>
        const parts = scope.split(':');
        if (parts.length !== 3 || parts.some(p => !p.trim())) {
            return res.status(400).json({ error: 'Scope must be in format <appId>:<action>:<resource>' });
        }
        // Validar que <action>:<resource> exista en ROLE_SCOPES
        const { ROLE_SCOPES } = require('../routes/authRoutes');
        const validActions = new Set();
        (Object.values(ROLE_SCOPES) as string[][]).forEach((scopesArr) => scopesArr.forEach(s => validActions.add(s)));
        if (!validActions.has(`${parts[1]}:${parts[2]}`)) {
            return res.status(400).json({ error: 'Scope action/resource not recognized' });
        }
        const user: User | null = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.scopes = Array.isArray(user.scopes) ? user.scopes : [];
        if (!user.scopes.includes(scope)) user.scopes.push(scope);
        await userService.update(userId, { scopes: user.scopes });
        res.json({ userId, scopes: user.scopes });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

// Quitar un scope directo del usuario
export const removeUserScope = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { scope } = req.body;
        if (!scope || typeof scope !== 'string') return res.status(400).json({ error: 'Scope required' });
        const user: User | null = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.scopes = Array.isArray(user.scopes) ? user.scopes : [];
        user.scopes = user.scopes.filter(s => s !== scope);
        await userService.update(userId, { scopes: user.scopes });
        res.json({ userId, scopes: user.scopes });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

// Añadir un revokedScope al usuario
export const addUserRevokedScope = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { scope } = req.body;
        if (!scope || typeof scope !== 'string') return res.status(400).json({ error: 'Scope required' });
        // Validar patrón <appId>:<action>:<resource>
        const parts = scope.split(':');
        if (parts.length !== 3 || parts.some(p => !p.trim())) {
            return res.status(400).json({ error: 'Scope must be in format <appId>:<action>:<resource>' });
        }
        // Validar que <action>:<resource> exista en ROLE_SCOPES
        const { ROLE_SCOPES } = require('../routes/authRoutes');
        const validActions = new Set();
        (Object.values(ROLE_SCOPES) as string[][]).forEach((scopesArr) => scopesArr.forEach(s => validActions.add(s)));
        if (!validActions.has(`${parts[1]}:${parts[2]}`)) {
            return res.status(400).json({ error: 'Scope action/resource not recognized' });
        }
        const user: User | null = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        (user as any).revokedScopes = Array.isArray((user as any).revokedScopes) ? (user as any).revokedScopes : [];
        if (!(user as any).revokedScopes.includes(scope)) (user as any).revokedScopes.push(scope);
        await userService.update(userId, { revokedScopes: (user as any).revokedScopes });
        res.json({ userId, revokedScopes: (user as any).revokedScopes });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

// Quitar un revokedScope del usuario
export const removeUserRevokedScope = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { scope } = req.body;
        if (!scope || typeof scope !== 'string') return res.status(400).json({ error: 'Scope required' });
        const user: User | null = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        (user as any).revokedScopes = Array.isArray((user as any).revokedScopes) ? (user as any).revokedScopes : [];
        (user as any).revokedScopes = (user as any).revokedScopes.filter((s: string) => s !== scope);
        await userService.update(userId, { revokedScopes: (user as any).revokedScopes });
        res.json({ userId, revokedScopes: (user as any).revokedScopes });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
import { ROLE_SCOPES, deriveScopes } from '../routes/authRoutes';

/**
 * Endpoint to get user scopes, distinguishing:
 * - derivedScopes: from roles (ROLE_SCOPES)
 * - directScopes: explicitly assigned to user (user.scopes)
 * - revokedScopes: explicitly revoked from user (user.revokedScopes)
 * - effectiveScopes: (derivedScopes ∪ directScopes) - revokedScopes
 *
 * Example response:
 * {
 *   "userId": "3",
 *   "derivedScopes": ["ratw3urj:read:users", "ratw3urj:write:catalogs"],
 *   "directScopes": ["ratw3urj:delete:catalogs"],
 *   "revokedScopes": ["ratw3urj:write:catalogs"],
 *   "effectiveScopes": ["ratw3urj:read:users", "ratw3urj:delete:catalogs"]
 * }
 */
export const getUserScopes = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        // Only self or admin can query
        const requester = (req as any).user;
        if (!requester) return res.status(401).json({ error: 'Unauthorized' });
        if (requester.userId !== userId && !(requester.scopes && requester.scopes.includes('*'))) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const user: User | null = await userService.getUserById ? await userService.getUserById(userId) : null;
        if (!user) return res.status(404).json({ error: 'User not found' });
        // Derived from roles
        let derivedScopes: string[] = [];
        if (user.rolesPorApp && user.appIds) {
            for (const appId of user.appIds) {
                const role = user.rolesPorApp[appId] || user.rolesPorApp['*'];
                if (role && ROLE_SCOPES[role]) {
                    for (const scope of ROLE_SCOPES[role]) {
                        if (scope === '*') {
                            derivedScopes.push('*');
                        } else {
                            derivedScopes.push(`${appId}:${scope}`);
                        }
                    }
                }
            }
        }
        // Direct (manual exceptions)
        const directScopes: string[] = Array.isArray(user.scopes) ? user.scopes : [];
        // Revoked (explicit deny)
        const revokedScopes: string[] = Array.isArray((user as any).revokedScopes) ? (user as any).revokedScopes : [];
        // Effective: (derived ∪ direct) - revoked
        const effectiveScopes = Array.from(new Set([...derivedScopes, ...directScopes])).filter(s => !revokedScopes.includes(s));
        res.json({ userId, derivedScopes, directScopes, revokedScopes, effectiveScopes });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
// Listar usuarios con paginación estándar
import { Request, Response } from 'express';
import { userService } from 'user-management';
import { User } from 'user-management/dist/adapters/IUserRepository';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
// Devuelve la lista de apps permitidas para el usuario autenticado
import { applicationService } from 'application-management';

export const listUsers = async (req: Request, res: Response) => {
    try {
        // Paginación: ?limit=20&offset=0
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20));
        const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
        const allUsers = await userService.listAllUsers();
        const total = allUsers.length;
        const users = allUsers.slice(offset, offset + limit);
        res.json({
            total,
            limit,
            offset,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getUserApps = async (req: Request, res: Response) => {
    try {
        // Permitir obtener userId desde token o query
        const userId = (req as any).user?.userId || req.query.userId || req.params.userId;
        if (!userId) return res.status(400).json({ error: 'userId required' });
        const user: User | null = await userService.getUserById ? await userService.getUserById(userId) : null;
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const allApps = await applicationService.listApplications();
        const allowedAppIds = user.appIds || [];
        // '*' significa acceso a todas las apps
        const apps = allowedAppIds.includes('*')
            ? allApps
            : allApps.filter(app => allowedAppIds.includes(app.id));
        res.json({ apps });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ error: 'userId required' });
        const user: User | null = await userService.getUserById ? await userService.getUserById(userId) : null;
        if (!user) return res.status(404).json({ error: 'No encontrado' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        // Permitir username como alias de name
        let { id, email, name, username, password, appIds, rolesPorApp } = req.body;
        if (!password || typeof password !== 'string' || password.length < 4) {
            return res.status(400).json({ error: 'Password is required and must be at least 4 characters.' });
        }
        // Generar userId único si no se provee
        const userId = id || randomUUID();
        const passwordHash = await bcrypt.hash(password, 10);
        const user: User = {
            id: userId,
            email: email || username || name,
            name: username || name || email,
            passwordHash,
            appIds: appIds || [],
            rolesPorApp: rolesPorApp || {}
        };
        const created = await userService.register(user);
        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};


export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        // Permitir búsqueda por username o email
        const { email, username } = req.params;
        let user: User | null = null;
        if (username) {
            user = await userService.getUserByUsername(username);
        } else if (email) {
            user = await userService.getUserByEmail(email);
        }
        if (!user) return res.status(404).json({ error: 'No encontrado' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
