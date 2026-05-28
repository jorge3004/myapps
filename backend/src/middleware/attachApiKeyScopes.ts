import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to extract API key scopes from authenticated user/app and attach to req.apiKey.
 * Assumes that authentication middleware has already set req.user or req.app with scopes.
 */
export function attachApiKeyScopes(req: Request, res: Response, next: NextFunction) {
    // Example: if using user tokens with scopes
    if ((req as any).user && (req as any).user.scopes) {
        (req as any).apiKey = { scopes: (req as any).user.scopes };
    }
    // Example: if using app tokens with scopes
    if ((req as any).app && (req as any).app.scopes) {
        (req as any).apiKey = { scopes: (req as any).app.scopes };
    }
    next();
}
