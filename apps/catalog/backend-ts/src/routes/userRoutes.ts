import { Router } from 'express';
import { userService } from 'user-management';

const router = Router();

// Ruta para registrar un usuario de ejemplo
router.post('/register', async (req, res) => {
    try {
        const { id, email, name, passwordHash } = req.body;
        const user = await userService.register({ id, email, name, passwordHash });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Ruta para obtener usuario por email
router.get('/by-email/:email', async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        if (!user) return res.status(404).json({ error: 'No encontrado' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
