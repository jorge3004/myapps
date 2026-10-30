import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as appService from '../services/appService';
import { ROLE_SCOPES } from '../services/authorizationService';
import { User } from '../models/user';
import { requireParam } from './helpers/requestParams';

export const assignUserAppRole = async (req: Request, res: Response) => {
    try {
        const userId = requireParam(req, 'userId');
        const { appId, role } = req.body || {};

        if (!appId || typeof appId !== 'string') return res.status(400).json({ error: 'appId required' });
        const resolvedRole = typeof role === 'string' && role.trim() ? role : 'user';

        if (!ROLE_SCOPES[resolvedRole]) {
            return res.status(400).json({ error: 'Invalid role. Allowed: admin, user, editor' });
        }

        const user: User | null = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const app = await appService.getApplicationById(appId);
        if (!app) return res.status(404).json({ error: 'App not found' });

        await userService.assignUserToApp(userId, appId, resolvedRole);
        const appRoles = await userService.getUserAppRoles(userId);

        return res.json({
            userId,
            appId,
            role: resolvedRole,
            appRoles
        });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};

export const removeUserAppRole = async (req: Request, res: Response) => {
    try {
        const userId = requireParam(req, 'userId');
        const appId = requireParam(req, 'appId');

        const user: User | null = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await userService.removeUserFromApp(userId, appId);
        const appRoles = await userService.getUserAppRoles(userId);

        return res.json({
            userId,
            removedAppId: appId,
            appRoles
        });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
};
