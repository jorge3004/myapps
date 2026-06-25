import { Router } from 'express';
import { listUsers, registerUser, getUserByEmail, getUserById, getUserApps, getUserScopes, addUserScope, removeUserScope, addUserRevokedScope, removeUserRevokedScope, assignUserAppRole, removeUserAppRole } from '../controllers/userController';
import { attachApiKeyScopes } from '../middleware/attachApiKeyScopes';
import { requireScope } from '../middleware/requireScope';
import { verifyUserToken } from '../middleware/auth';
import { requireAppAccess } from '../middleware/requireAppAccess';

const router = Router();

// GET /api/users (listado paginado) — requiere scope de lectura de usuarios para la app
router.get(
    '/',
    verifyUserToken,
    attachApiKeyScopes,
    requireScope({ appId: '*', action: 'read', resource: 'users' }),
    listUsers
);
// POST /api/users
router.post(
    '/',
    verifyUserToken,
    requireScope({ appId: '*', action: 'write', resource: 'users' }),
    registerUser
);
// GET /api/users/by-email/:email
router.get('/by-email/:email', getUserByEmail);
// GET /api/users/by-username/:username
router.get('/by-username/:username', getUserByEmail);
router.get('/:userId/apps', getUserApps);
router.post('/:userId/apps', verifyUserToken, requireScope({ appId: '*', action: 'write', resource: 'users' }), requireAppAccess({ source: 'body' }), assignUserAppRole);
router.delete('/:userId/apps/:appId', verifyUserToken, requireScope({ appId: '*', action: 'write', resource: 'users' }), requireAppAccess({ source: 'params' }), removeUserAppRole);
router.get('/:userId', getUserById);

// Gestión dinámica de scopes directos
router.get('/:userId/scopes', verifyUserToken, getUserScopes);
router.post('/:userId/scopes', verifyUserToken, addUserScope);
router.delete('/:userId/scopes', verifyUserToken, removeUserScope);

// Gestión dinámica de revokedScopes
router.post('/:userId/revoked-scopes', verifyUserToken, addUserRevokedScope);
router.delete('/:userId/revoked-scopes', verifyUserToken, removeUserRevokedScope);

export default router;
