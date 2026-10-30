import { Router } from 'express';
import { listUsers, registerUser, getUserByEmail, getUserByUsername, getUserById, getUserApps } from '../controllers/userController';
import { getUserScopes, addUserScope, removeUserScope, addUserRevokedScope, removeUserRevokedScope } from '../controllers/userScopeController';
import { assignUserAppRole, removeUserAppRole } from '../controllers/userAppRoleController';
import { attachApiKeyScopes } from '../middleware/attachApiKeyScopes';
import { requireScope } from '../middleware/requireScope';
import { verifyUserToken } from '../middleware/auth';
import { requireSelfOrScope } from '../middleware/requireSelfOrScope';
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
const canWriteUsers = requireScope({ appId: '*', action: 'write', resource: 'users' });
const canReadUsers = requireScope({ appId: '*', action: 'read', resource: 'users' });
const selfOrReadUsers = requireSelfOrScope({ param: 'userId', action: 'read', resource: 'users' });

// Búsquedas: solo con scope de lectura de usuarios. Van antes de /:userId.
router.get('/by-email/:email', verifyUserToken, canReadUsers, getUserByEmail);
router.get('/by-username/:username', verifyUserToken, canReadUsers, getUserByUsername);

router.get('/:userId/apps', verifyUserToken, selfOrReadUsers, getUserApps);
router.post('/:userId/apps', verifyUserToken, canWriteUsers, requireAppAccess({ source: 'body' }), assignUserAppRole);
router.delete('/:userId/apps/:appId', verifyUserToken, canWriteUsers, requireAppAccess({ source: 'params' }), removeUserAppRole);
router.get('/:userId', verifyUserToken, selfOrReadUsers, getUserById);

// Gestión dinámica de scopes directos (leer: dueño o admin dentro del controlador; escribir: write:users)
router.get('/:userId/scopes', verifyUserToken, getUserScopes);
router.post('/:userId/scopes', verifyUserToken, canWriteUsers, addUserScope);
router.delete('/:userId/scopes', verifyUserToken, canWriteUsers, removeUserScope);

// Gestión dinámica de revokedScopes
router.post('/:userId/revoked-scopes', verifyUserToken, canWriteUsers, addUserRevokedScope);
router.delete('/:userId/revoked-scopes', verifyUserToken, canWriteUsers, removeUserRevokedScope);

export default router;
