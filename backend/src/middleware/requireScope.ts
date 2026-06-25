import { Request, Response, NextFunction } from 'express';
import { hasRequiredScope } from '../services/authorizationService';

/**
 * Middleware to require a specific scope for an endpoint, supporting wildcards and appId.
 * Usage: app.get('/route', requireScope({ appId, action, resource }), handler)
 */
export function requireScope({ appId, action, resource }: { appId: string | '*', action: string | '*', resource: string | '*' }) {
    return (req: Request, res: Response, next: NextFunction) => {
        const scopes: string[] = (req as any).apiKey?.scopes || [];
        if (hasRequiredScope(scopes, { appId, action, resource })) {
            return next();
        }
        return res.status(403).json({ error: 'Insufficient scope' });
    };
}
