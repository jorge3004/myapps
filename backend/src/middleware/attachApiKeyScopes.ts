import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to extract API key scopes from authenticated user/app and attach to req.apiKey.
 * Assumes that authentication middleware has already set req.user or req.app with scopes.
 */
export function attachApiKeyScopes(req: Request, _res: Response, next: NextFunction) {
    // Example: if using user tokens with scopes
    if (req.user && req.user.scopes) {
        req.apiKey = { scopes: req.user.scopes };
    }
    // Example: if using app tokens with scopes
    if (req.authApp && req.authApp.scopes) {
        req.apiKey = { scopes: req.authApp.scopes };
    }
    next();
}
