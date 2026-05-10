// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware para validar JWT y obtener usuario real de la base de datos
// Middleware: requiere usuario autenticado (cualquier rol)
exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
    try {
      const [rows] = await db.query('SELECT id, username, role FROM users WHERE id = ?', [payload.id]);
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
      }
      req.user = rows[0];
      next();
    } catch (e) {
      return res.status(500).json({ success: false, message: 'Error de base de datos' });
    }
  });
};

// Middleware: requiere usuario autenticado y admin
exports.requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
    try {
      const [rows] = await db.query('SELECT id, username, role FROM users WHERE id = ?', [payload.id]);
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
      }
      if (rows[0].role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Solo administradores' });
      }
      req.user = rows[0];
      next();
    } catch (e) {
      return res.status(500).json({ success: false, message: 'Error de base de datos' });
    }
  });
};
