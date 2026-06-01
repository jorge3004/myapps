// Apps controller - MySQL-backed via appService

import { Request, Response } from 'express';
import * as applicationService from '../services/appService';

export const revokeApiKeyGlobal = async (req: Request, res: Response) => {
    try {
        const { apiKey } = req.params;
        const apps = await applicationService.listApplications();
        let found = false;
        let updatedApp = null;
        for (const app of apps) {
            const match = app.apiKeys.find(k => k.apiKey === apiKey);
            if (match) {
                const revokedBy = (req as any).user?.userId || undefined;
                updatedApp = await applicationService.revokeApiKey(app.id, apiKey, revokedBy);
                found = true;
                break;
            }
        }
        if (!found) throw new Error('API key not found');
        res.json({ success: true, app: updatedApp });
    } catch (err: any) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const revokeApiKey = async (req: Request, res: Response) => {
    try {
        const { appId, apiKey } = req.params;
        const revokedBy = (req as any).user?.userId || undefined;
        const app = await applicationService.revokeApiKey(appId, apiKey, revokedBy);
        res.json({ success: true, app });
    } catch (err: any) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const registerApp = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const app = await applicationService.register({ name, description });
        res.status(201).json(app);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};


export const addApiKey = async (req: Request, res: Response) => {
    try {
        const { appId } = req.params;
        const { scopes } = req.body;
        const apiKey = await applicationService.addApiKey(appId, scopes || ['*']);
        res.status(201).json(apiKey);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
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
