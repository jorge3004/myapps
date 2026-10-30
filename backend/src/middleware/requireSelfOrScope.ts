import { Request, Response, NextFunction } from 'express';
import { hasRequiredScope } from '../services/authorizationService';

/**
 * Permite el acceso si el usuario autenticado es el dueño de `req.params[param]`
 * o si tiene el scope indicado. Debe ir después de verifyUserToken.
 */
export function requireSelfOrScope({ param, action, resource }: { param: string; action: string; resource: string }) {
    return (req: Request, res: Response, next: NextFunction) => {
        const targetId = req.params[param];
        if (targetId && req.user?.userId === targetId) {
            return next();
        }
        const scopes: string[] = req.apiKey?.scopes || [];
        if (hasRequiredScope(scopes, { appId: '*', action, resource })) {
            return next();
        }
        return res.status(403).json({ error: 'Forbidden' });
    };
}
