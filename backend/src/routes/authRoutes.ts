import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from 'user-management';
import { User } from '../types/user';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const TOKEN_EXPIRATION = '1h';

// Usuario admin fijo en memoria
// username: "jorge" (name y email)
const adminUser = {
    id: '1',
    email: 'jorge', // username
    name: 'jorge', // username
    passwordHash: 'jorge123', // Solo para pruebas, en real usar hash seguro
    appIds: ['*'], // '*' significa acceso a todas las apps
    rolesPorApp: { '*': 'admin' } // admin global
};

// Inicializar usuario admin en memoria si no existe
(async () => {
    const existing = await userService.getUserByEmail(adminUser.email);
    if (!existing) {
        await userService.register(adminUser);
    }
})();

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password, appId } = req.body;
        if (!username || !password || !appId) {
            return res.status(400).json({ error: 'Username, password, and appId required' });
        }
        // Buscar usuario por username (en este modelo, username == name)
        const user: User | null = await userService.getUserByUsername
            ? await userService.getUserByUsername(username)
            : await userService.getUserByEmail(username);
        if (!user || user.passwordHash !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Validar acceso a la app por appId
        const allowedAppIds = user.appIds || [];
        const hasAccess = allowedAppIds.includes('*') || allowedAppIds.includes(appId);
        if (!hasAccess) {
            return res.status(403).json({ error: 'User does not have access to this app' });
        }
        // Determinar el rol para este appId
        const rolesPorApp = user.rolesPorApp || {};
        const role = rolesPorApp[appId] || rolesPorApp['*'] || 'user';
        const payload = {
            type: 'user',
            userId: user.id,
            username: user.name,
            appId,
            role,
            appIds: allowedAppIds,
            rolesPorApp
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        res.json({ token });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
