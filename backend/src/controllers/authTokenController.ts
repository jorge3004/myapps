import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { applicationService } from 'application-management';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const TOKEN_EXPIRATION = '1h';

export const issueAppToken = async (req: Request, res: Response) => {
    try {
        let apiKey = req.body?.apiKey;
        if (!apiKey) {
            const headerKey = req.headers['x-api-key'];
            if (Array.isArray(headerKey)) {
                apiKey = headerKey[0];
            } else {
                apiKey = headerKey;
            }
        }
        if (!apiKey || typeof apiKey !== 'string') {
            return res.status(400).json({ error: 'apiKey required (in body or x-api-key header)' });
        }
        const apps = await applicationService.listApplications();
        const app = apps.find(a => Array.isArray(a.apiKeys) && a.apiKeys.some(k => k && typeof k.apiKey === 'string' && k.apiKey === apiKey));
        if (!app) return res.status(401).json({ error: 'Invalid API key' });
        const keyObj = (app.apiKeys || []).find(k => k && typeof k.apiKey === 'string' && k.apiKey === apiKey);
        if (!keyObj) return res.status(401).json({ error: 'API key not found in application' });
        const payload = {
            type: 'app',
            appId: app.id,
            appName: app.name,
            scopes: keyObj.scopes || []
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        res.json({ token });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
