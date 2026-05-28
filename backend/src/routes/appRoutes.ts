import { revokeApiKeyGlobal } from '../controllers/appController';
// DELETE /api/apikeys/:apiKey (revoca globalmente, preparado para ambientes)
import { revokeApiKey } from '../controllers/appController';
// POST /api/apps/:appId/apikeys/:apiKey/revoke
// Endpoint de prueba para debug
import { Router } from 'express';
import { registerApp, listApps, addApiKey } from '../controllers/appController';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();
router.post('/:appId/apikeys/:apiKey/revoke', verifyToken, requireRole('admin'), revokeApiKey);
// Crear nueva API key para una app existente
router.post('/:appId/apikeys', verifyToken, requireRole('admin'), addApiKey);
router.delete('/apikeys/:apiKey', verifyToken, requireRole('admin'), revokeApiKeyGlobal);

// POST /api/apps (solo admin)
router.post('/', verifyToken, requireRole('admin'), registerApp);

// GET /api/apps
router.get('/', verifyToken, listApps);

export default router;
