const ApiKey = require('../models/apiKey');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET;

// Crear nueva API key para el usuario autenticado (developer)
exports.createApiKey = async (req, res) => {
  const user_id = req.user.id;
  const { scopes } = req.body; // array de strings
  if (!Array.isArray(scopes) || scopes.length === 0) {
    return res.status(400).json({ success: false, message: 'Scopes required' });
  }
  const api_key = randomBytes(32).toString('hex');
  await ApiKey.create(user_id, api_key, scopes);
  res.json({ success: true, api_key });
};

// Listar API keys del usuario
exports.listApiKeys = async (req, res) => {
  const user_id = req.user.id;
  const keys = await ApiKey.listByUser(user_id);
  res.json({ success: true, keys });
};

// Revocar una API key
exports.revokeApiKey = async (req, res) => {
  const user_id = req.user.id;
  const { api_key } = req.body;
  const key = await ApiKey.findByKey(api_key);
  if (!key || key.user_id !== user_id) {
    return res.status(404).json({ success: false, message: 'API key not found' });
  }
  await ApiKey.revoke(api_key);
  res.json({ success: true });
};

// Generar token temporal usando API key
exports.createTokenFromApiKey = async (req, res) => {
  const { api_key } = req.body;
  const key = await ApiKey.findByKey(api_key);
  if (!key) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  const payload = {
    api_key_id: key.id,
    user_id: key.user_id,
    scopes: JSON.parse(key.scopes)
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' });
  res.json({ success: true, token });
};
