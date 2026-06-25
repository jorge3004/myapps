import { Request, Response, NextFunction } from 'express';
import { buildAuthorizationContextFromClaims, canAccessApp } from '../services/authorizationService';

type Source = 'params' | 'body' | 'query';

interface RequireAppAccessOptions {
    source: Source;
    key?: string;
}

export function requireAppAccess(options: RequireAppAccessOptions) {
    const key = options.key || 'appId';

    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const container = (req as any)[options.source] || {};
        const rawAppId = container[key];

        if (typeof rawAppId !== 'string' || !rawAppId.trim()) {
            return res.status(400).json({ error: `${key} required` });
        }

        const targetAppId = rawAppId.trim();
        const context = buildAuthorizationContextFromClaims(user);

        if (!canAccessApp(context, targetAppId)) {
            return res.status(403).json({ error: `User does not have access to app '${targetAppId}'` });
        }

        next();
    };
}
