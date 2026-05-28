import { Router } from 'express';
import { issueAppToken } from '../controllers/authTokenController';

const router = Router();

// POST /api/auth/token
router.post('/token', issueAppToken);

export default router;
