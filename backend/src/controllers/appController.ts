import { Request, Response } from 'express';
import { applicationService } from 'application-management';

export const registerApp = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const app = await applicationService.register({ name, description });
        res.status(201).json(app);
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
