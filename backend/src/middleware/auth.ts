import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { normalizeScopes } from '../services/authorizationService';
import { AuthAppPayload, AuthUserPayload } from '../auth/authPayloads';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware para requerir un rol específico (ej: 'admin')
export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user || user.role !== role) {
            return res.status(403).json({ error: 'Insufficient permissions: requires role ' + role });
        }
        return next();
    };
}
// Middleware para validar token de app
export function verifyAppToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        const payload = jwt.verify(token, JWT_SECRET) as AuthAppPayload;
        if (payload.type !== 'app') {
            return res.status(403).json({ error: 'Token is not an app token' });
        }
        req.authApp = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// Middleware para validar token de usuario
export function verifyUserTokenStrict(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        const payload = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
        if (payload.type !== 'user') {
            return res.status(403).json({ error: 'Token is not a user token' });
        }
        req.user = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export function verifyUserToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        const payload = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
        if (payload.type && payload.type !== 'user') {
            return res.status(403).json({ error: 'Token is not a user token' });
        }
        req.user = payload;
        req.apiKey = { scopes: normalizeScopes(payload?.scopes) };
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// Alias para mantener consistencia en las rutas
export const verifyToken = verifyUserToken;
