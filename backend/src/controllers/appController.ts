// 2026-05-28 Endpoint global para revocación de API keys, preparado para ambientes múltiples

import { Request, Response } from 'express';
import { applicationService } from 'application-management';

export const revokeApiKeyGlobal = async (req: Request, res: Response) => {
    try {
        const { apiKey } = req.params;
        const apps = await applicationService.listApplications();
        let found = false;
        let updatedApp = null;
        for (const app of apps) {
            const idx = app.apiKeys.findIndex(k => k.apiKey === apiKey);
            if (idx !== -1) {
                // Solo llamar a revokeApiKey, que maneja toda la lógica y validación
                const revokedBy = (req as any).user?.userId || undefined;
                updatedApp = await applicationService.revokeApiKey(app.id, apiKey, revokedBy);
                found = true;
                break;
            }
        }
        if (!found) throw new Error('API key not found');
        if (updatedApp) {
            updatedApp.apiKeys = (applicationService as any).constructor.normalizeApiKeys(updatedApp.apiKeys);
        }
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
        if (app) {
            app.apiKeys = (applicationService as any).constructor.normalizeApiKeys(app.apiKeys);
        }
        res.json({ success: true, app });
    } catch (err: any) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const registerApp = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const app = await applicationService.register({ name, description });
        if (app) {
            app.apiKeys = (applicationService as any).constructor.normalizeApiKeys(app.apiKeys);
        }
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
        if (apiKey) {
            apiKey.revoked = !!apiKey.revoked;
            if (!apiKey.revoked) {
                delete apiKey.revokedAt;
                delete apiKey.revokedBy;
            }
        }
        res.status(201).json(apiKey);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const listApps = async (_req: Request, res: Response) => {
    try {
        const apps = await applicationService.listApplications();
        const normalized = apps.map(app => ({
            ...app,
            apiKeys: (applicationService as any).constructor.normalizeApiKeys(app.apiKeys)
        }));
        res.json(normalized);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
