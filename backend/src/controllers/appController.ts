// Apps controller - MySQL-backed via appService

import { Request, Response } from 'express';
import * as applicationService from '../services/appService';

export const revokeApiKeyGlobal = async (req: Request, res: Response) => {
    try {
        const { apiKey } = req.params;
        if (!apiKey) return res.status(400).json({ error: 'apiKey required' });
        const apps = await applicationService.listApplications();
        let found = false;
        let updatedApp = null;
        for (const app of apps) {
            const match = app.apiKeys.find(k => k.apiKey === apiKey);
            if (match) {
                const revokedBy = req.user?.userId || undefined;
                updatedApp = await applicationService.revokeApiKey(app.id, apiKey, revokedBy);
                found = true;
                break;
            }
        }
        if (!found) throw new Error('API key not found');
        return res.json({ success: true, app: updatedApp });
    } catch (err: any) {
        return res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const revokeApiKey = async (req: Request, res: Response) => {
    try {
        const { appId, apiKey } = req.params;
        if (!appId || !apiKey) return res.status(400).json({ error: 'appId and apiKey required' });
        const revokedBy = req.user?.userId || undefined;
        const app = await applicationService.revokeApiKey(appId, apiKey, revokedBy);
        return res.json({ success: true, app });
    } catch (err: any) {
        return res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const registerApp = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const app = await applicationService.register({ name, description });
        return res.status(201).json(app);
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
};


export const addApiKey = async (req: Request, res: Response) => {
    try {
        const { appId } = req.params;
        if (!appId) return res.status(400).json({ error: 'appId required' });
        const { scopes } = req.body;
        const apiKey = await applicationService.addApiKey(appId, scopes || ['*']);
        return res.status(201).json(apiKey);
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
};

export const listApps = async (_req: Request, res: Response) => {
    try {
        const apps = await applicationService.listApplications();
        res.json(apps);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
