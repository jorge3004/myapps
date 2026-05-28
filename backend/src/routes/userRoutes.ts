import { Router } from 'express';
import { listUsers, registerUser, getUserByEmail, getUserById, getUserApps } from '../controllers/userController';

const router = Router();

// GET /api/users (listado paginado)
router.get('/', listUsers);
// POST /api/users
router.post('/', registerUser);
// GET /api/users/by-email/:email
router.get('/by-email/:email', getUserByEmail);
// GET /api/users/by-username/:username
router.get('/by-username/:username', getUserByEmail);
router.get('/:userId/apps', getUserApps);
router.get('/:userId', getUserById);

export default router;
