// Endpoint de prueba para debug
import { Router } from 'express';
import { registerApp, listApps } from '../controllers/appController';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();

// POST /api/apps (solo admin)
router.post('/', verifyToken, requireRole('admin'), registerApp);

// GET /api/apps
router.get('/', verifyToken, listApps);

export default router;
