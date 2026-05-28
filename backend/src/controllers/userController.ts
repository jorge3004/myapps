// Listar usuarios con paginación estándar
import { Request, Response } from 'express';
import { userService } from 'user-management';
import { User } from '../types/user';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
// Devuelve la lista de apps permitidas para el usuario autenticado
import { applicationService } from 'application-management';

export const listUsers = async (req: Request, res: Response) => {
    try {
        // Paginación: ?limit=20&offset=0
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20));
        const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
        const allUsers = await userService.listAllUsers();
        const total = allUsers.length;
        const users = allUsers.slice(offset, offset + limit);
        res.json({
            total,
            limit,
            offset,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getUserApps = async (req: Request, res: Response) => {
    try {
        // Permitir obtener userId desde token o query
        const userId = (req as any).user?.userId || req.query.userId || req.params.userId;
        if (!userId) return res.status(400).json({ error: 'userId required' });
        const user: User | null = await userService.getUserById ? await userService.getUserById(userId) : null;
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const allApps = await applicationService.listApplications();
        const allowedAppIds = user.appIds || [];
        // '*' significa acceso a todas las apps
        const apps = allowedAppIds.includes('*')
            ? allApps
            : allApps.filter(app => allowedAppIds.includes(app.id));
        res.json({ apps });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ error: 'userId required' });
        const user: User | null = await userService.getUserById ? await userService.getUserById(userId) : null;
        if (!user) return res.status(404).json({ error: 'No encontrado' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        // Permitir username como alias de name
        let { id, email, name, username, password, appIds, rolesPorApp } = req.body;
        if (!password || typeof password !== 'string' || password.length < 4) {
            return res.status(400).json({ error: 'Password is required and must be at least 4 characters.' });
        }
        // Generar userId único si no se provee
        const userId = id || randomUUID();
        const passwordHash = await bcrypt.hash(password, 10);
        const user: User = {
            id: userId,
            email: email || username || name,
            name: username || name || email,
            passwordHash,
            appIds: appIds || [],
            rolesPorApp: rolesPorApp || {}
        };
        const created = await userService.register(user);
        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};


export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        // Permitir búsqueda por username o email
        const { email, username } = req.params;
        let user: User | null = null;
        if (username) {
            user = await userService.getUserByUsername(username);
        } else if (email) {
            user = await userService.getUserByEmail(email);
        }
        if (!user) return res.status(404).json({ error: 'No encontrado' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
