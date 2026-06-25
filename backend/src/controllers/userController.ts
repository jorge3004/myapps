
import { ROLE_SCOPES } from '../services/authorizationService';

function getUserId(length = 16): string {
    return randomUUID().replace(/-/g, '').slice(0, length);
}
import { logAudit } from '../audit/auditLog';


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
        // Auditoría
        const actor = (req as any).user || {};
        logAudit({
            actorId: actor.id || actor.userId || 'unknown',
            actorEmail: actor.email,
            action: 'add_scope',
            targetType: 'user',
            targetId: userId,
            details: { scopeAdded: scope }
        });
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
        user.scopes = user.scopes.filter((s: string) => s !== scope);
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
        const appRoles = await userService.getUserAppRoles(userId);
        const rolesPorApp = appRoles.reduce((acc: Record<string, string>, row: { appId: string; role: string }) => {
            acc[row.appId] = row.role;
            return acc;
        }, {});
        const appIds = appRoles.map((row: { appId: string; role: string }) => row.appId);

        // Derived from roles
        let derivedScopes: string[] = [];
        if (appIds.length > 0) {
            for (const appId of appIds) {
                const role = rolesPorApp[appId] || rolesPorApp['*'];
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
import * as userService from '../services/userService';
type User = any;
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
// Devuelve la lista de apps permitidas para el usuario autenticado
import * as appService from '../services/appService';

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
        const allApps = await appService.listApplications();
        const appRoles = await userService.getUserAppRoles(String(userId));
        const allowedAppIds = appRoles.map((row: { appId: string; role: string }) => row.appId);
        // '*' significa acceso a todas las apps
        const apps = allowedAppIds.includes('*')
            ? allApps
            : allApps.filter(app => allowedAppIds.includes(app.id));
        res.json({ apps });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const assignUserAppRole = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { appId, role } = req.body || {};

        if (!userId) return res.status(400).json({ error: 'userId required' });
        if (!appId || typeof appId !== 'string') return res.status(400).json({ error: 'appId required' });
        const resolvedRole = typeof role === 'string' && role.trim() ? role : 'user';

        if (!ROLE_SCOPES[resolvedRole]) {
            return res.status(400).json({ error: 'Invalid role. Allowed: admin, user, editor' });
        }

        const user: User | null = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const app = await appService.getApplicationById(appId);
        if (!app) return res.status(404).json({ error: 'App not found' });

        await userService.assignUserToApp(userId, appId, resolvedRole);
        const appRoles = await userService.getUserAppRoles(userId);

        res.json({
            userId,
            appId,
            role: resolvedRole,
            appRoles
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const removeUserAppRole = async (req: Request, res: Response) => {
    try {
        const { userId, appId } = req.params;
        if (!userId) return res.status(400).json({ error: 'userId required' });
        if (!appId) return res.status(400).json({ error: 'appId required' });

        const user: User | null = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await userService.removeUserFromApp(userId, appId);
        const appRoles = await userService.getUserAppRoles(userId);

        res.json({
            userId,
            removedAppId: appId,
            appRoles
        });
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
        const actor = (req as any).user || {};
        logAudit({
            actorId: actor.id || actor.userId || 'unknown',
            actorEmail: actor.email,
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

        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};


export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        // Permitir búsqueda solo por email
        const { email } = req.params;
        let user: User | null = null;
        if (email) {
            user = await userService.getUserByEmail(email);
        }
        if (!user) return res.status(404).json({ error: 'No encontrado' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
