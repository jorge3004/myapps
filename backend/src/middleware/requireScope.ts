import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to require a specific scope for an endpoint, supporting wildcards and appId.
 * Usage: app.get('/route', requireScope({ appId, action, resource }), handler)
 */
export function requireScope({ appId, action, resource }: { appId: string | '*', action: string | '*', resource: string | '*' }) {
    return (req: Request, res: Response, next: NextFunction) => {
        const scopes: string[] = (req as any).apiKey?.scopes || [];
        // '*' en scopes otorga acceso total
        if (scopes.includes('*')) {
            return next();
        }
        // Compose all possible patterns to match
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
        if (scopes.some(scope => patterns.includes(scope))) {
            return next();
        }
        return res.status(403).json({ error: 'Insufficient scope' });
    };
}
