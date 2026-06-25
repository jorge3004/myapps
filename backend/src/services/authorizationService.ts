import { User } from '../models/user';
import { AppRole } from '../repositories/userRepository';

export const ROLE_SCOPES: Record<string, string[]> = {
    admin: ['*'],
    user: ['read:users', 'read:catalogs'],
    editor: ['read:users', 'write:catalogs']
};

export interface UserAuthorizationContext {
    allowedAppIds: string[];
    rolesPorApp: Record<string, string>;
    isGlobalAdmin: boolean;
    effectiveScopes: string[];
}

export interface ScopeRequirement {
    appId: string | '*';
    action: string | '*';
    resource: string | '*';
}

export interface UserTokenClaimsLike {
    appId?: string;
    appIds?: string[];
    role?: string;
    rolesPorApp?: Record<string, string>;
    scopes?: string[];
}

export function deriveScopes(user: User, rolesPorApp: Record<string, string>, appIds: string[]): string[] {
    const scopes = new Set<string>();

    for (const appId of appIds) {
        const role = rolesPorApp[appId];
        if (!role || !ROLE_SCOPES[role]) continue;

        for (const scope of ROLE_SCOPES[role]) {
            if (scope === '*') {
                scopes.add('*');
            } else {
                scopes.add(`${appId}:${scope}`);
            }
        }
    }

    for (const directScope of user.scopes || []) {
        scopes.add(directScope);
    }

    for (const revokedScope of user.revokedScopes || []) {
        scopes.delete(revokedScope);
    }

    return Array.from(scopes);
}

export function buildUserAuthorizationContext(user: User, appRoles: AppRole[]): UserAuthorizationContext {
    const rolesPorApp = appRoles.reduce((acc: Record<string, string>, row) => {
        acc[row.appId] = row.role;
        return acc;
    }, {});

    const allowedAppIds = appRoles.map((row) => row.appId);
    const isGlobalAdmin = user.role === 'admin';

    return {
        allowedAppIds,
        rolesPorApp,
        isGlobalAdmin,
        effectiveScopes: deriveScopes(user, rolesPorApp, allowedAppIds)
    };
}

export function canAccessApp(context: UserAuthorizationContext, appId: string): boolean {
    return context.isGlobalAdmin || context.allowedAppIds.includes(appId);
}

export function resolveRoleForApp(context: UserAuthorizationContext, appId: string): string {
    if (context.isGlobalAdmin) return 'admin';
    return context.rolesPorApp[appId] || 'user';
}

export function normalizeScopes(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((scope): scope is string => typeof scope === 'string' && scope.trim().length > 0);
}

export function hasRequiredScope(scopes: string[], requirement: ScopeRequirement): boolean {
    if (scopes.includes('*')) return true;

    const { appId, action, resource } = requirement;
    const patterns = [
        `${appId}:${action}:${resource}`,
        `${appId}:${action}:*`,
        `${appId}:*:${resource}`,
        `${appId}:*:*`,
        `*:${action}:${resource}`,
        `*:${action}:*`,
        `*:*:${resource}`,
        `*:*:*`
    ];

    return scopes.some((scope) => patterns.includes(scope));
}

export function buildAuthorizationContextFromClaims(claims: UserTokenClaimsLike): UserAuthorizationContext {
    const appIdsFromList = Array.isArray(claims.appIds) ? claims.appIds : [];
    const appIdsFromTokenAppId = typeof claims.appId === 'string' && claims.appId !== '*' ? [claims.appId] : [];
    const allowedAppIds = Array.from(new Set([...appIdsFromList, ...appIdsFromTokenAppId]));
    const normalizedScopes = normalizeScopes(claims.scopes);

    return {
        allowedAppIds,
        rolesPorApp: claims.rolesPorApp || {},
        isGlobalAdmin: claims.role === 'admin' || claims.appId === '*' || normalizedScopes.includes('*'),
        effectiveScopes: normalizedScopes
    };
}
