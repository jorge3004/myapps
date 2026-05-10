const express = require('express');
const router = express.Router();
const developerController = require('../controllers/developerController');
const { verifyToken } = require('../controllers/user/authController');

// Solo para usuarios con rol developer
function isDeveloper(req, res, next) {
  if (req.user && req.user.role === 'developer') return next();
  return res.status(403).json({ success: false, message: 'Developer role required' });
}

// Crear nueva API key
router.post('/apikeys', verifyToken, isDeveloper, developerController.createApiKey);
// Listar API keys
router.get('/apikeys', verifyToken, isDeveloper, developerController.listApiKeys);
// Revocar API key
router.post('/apikeys/revoke', verifyToken, isDeveloper, developerController.revokeApiKey);
// Generar token temporal desde API key
router.post('/apikey-token', developerController.createTokenFromApiKey);

module.exports = router;