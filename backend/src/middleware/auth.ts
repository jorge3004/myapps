import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { normalizeScopes } from '../services/authorizationService';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware para requerir un rol específico (ej: 'admin')
export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || user.role !== role) {
            return res.status(403).json({ error: 'Insufficient permissions: requires role ' + role });
        }
        next();
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
        const payload = jwt.verify(token, JWT_SECRET) as any;
        if (payload.type !== 'app') {
            return res.status(403).json({ error: 'Token is not an app token' });
        }
        (req as any).app = payload;
        next();
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
        const payload = jwt.verify(token, JWT_SECRET) as any;
        if (payload.type !== 'user') {
            return res.status(403).json({ error: 'Token is not a user token' });
        }
        (req as any).user = payload;
        next();
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
        const payload = jwt.verify(token, JWT_SECRET) as any;
        if (payload.type && payload.type !== 'user') {
            return res.status(403).json({ error: 'Token is not a user token' });
        }
        (req as any).user = payload;
        (req as any).apiKey = { scopes: normalizeScopes(payload?.scopes) };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// Alias para mantener consistencia en las rutas
export const verifyToken = verifyUserToken;
