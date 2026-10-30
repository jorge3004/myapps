import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { ROLE_SCOPES } from '../services/authorizationService';
import { logAudit } from '../audit/auditLog';
import { User } from '../models/user';
import { requireParam, requireScopeString, validateScope } from './helpers/requestParams';

type ScopeField = 'scopes' | 'revokedScopes';

async function loadUserScopes(userId: string, field: ScopeField): Promise<{ user: User; list: string[] } | null> {
    const user: User | null = await userService.getUserById(userId);
    if (!user) return null;
    const list = Array.isArray(user[field]) ? user[field] as string[] : [];
    return { user, list };
}

// Añadir un scope directo al usuario
export const addUserScope = async (req: Request, res: Response) => {
    try {
        const userId = requireParam(req, 'userId');
        const scope = requireScopeString(req.body);
        validateScope(scope);
        const loaded = await loadUserScopes(userId, 'scopes');
        if (!loaded) return res.status(404).json({ error: 'User not found' });
        const scopes = loaded.list.includes(scope) ? loaded.list : [...loaded.list, scope];
        await userService.update(userId, { scopes });
        logAudit({
            actorId: req.user?.userId || 'unknown',
            action: 'add_scope',
            targetType: 'user',
            targetId: userId,
            details: { scopeAdded: scope }
        });
        return res.json({ userId, scopes });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};

// Quitar un scope directo del usuario
export const removeUserScope = async (req: Request, res: Response) => {
    try {
        const userId = requireParam(req, 'userId');
        const scope = requireScopeString(req.body);
        const loaded = await loadUserScopes(userId, 'scopes');
        if (!loaded) return res.status(404).json({ error: 'User not found' });
        const scopes = loaded.list.filter(s => s !== scope);
        await userService.update(userId, { scopes });
        return res.json({ userId, scopes });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};

// Añadir un revokedScope al usuario
export const addUserRevokedScope = async (req: Request, res: Response) => {
    try {
        const userId = requireParam(req, 'userId');
        const scope = requireScopeString(req.body);
        validateScope(scope);
        const loaded = await loadUserScopes(userId, 'revokedScopes');
        if (!loaded) return res.status(404).json({ error: 'User not found' });
        const revokedScopes = loaded.list.includes(scope) ? loaded.list : [...loaded.list, scope];
        await userService.update(userId, { revokedScopes });
        return res.json({ userId, revokedScopes });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};

// Quitar un revokedScope del usuario
export const removeUserRevokedScope = async (req: Request, res: Response) => {
    try {
        const userId = requireParam(req, 'userId');
        const scope = requireScopeString(req.body);
        const loaded = await loadUserScopes(userId, 'revokedScopes');
        if (!loaded) return res.status(404).json({ error: 'User not found' });
        const revokedScopes = loaded.list.filter(s => s !== scope);
        await userService.update(userId, { revokedScopes });
        return res.json({ userId, revokedScopes });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
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
        const userId = requireParam(req, 'userId');
        // Only self or admin can query
        const requester = req.user;
        if (!requester) return res.status(401).json({ error: 'Unauthorized' });
        if (requester.userId !== userId && !(requester.scopes && requester.scopes.includes('*'))) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const user: User | null = await userService.getUserById(userId);
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
        const revokedScopes: string[] = Array.isArray(user.revokedScopes) ? user.revokedScopes : [];
        // Effective: (derived ∪ direct) - revoked
        const effectiveScopes = Array.from(new Set([...derivedScopes, ...directScopes])).filter(s => !revokedScopes.includes(s));
        return res.json({ userId, derivedScopes, directScopes, revokedScopes, effectiveScopes });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};

