// POST /api/auth/reset-password
const bcrypt = require('bcryptjs');
exports.resetPassword = async (req, res) => {
  const { user_id, username, password } = req.body;
  if ((!user_id && !username) || !password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }
  try {
    // Buscar usuario por user_id o username
    let users;
    if (user_id) {
      [users] = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
    } else {
      [users] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    }
    if (!users.length) return res.status(404).json({ success: false, message: 'User not found' });
    const realUserId = users[0].id;
    // Verificar solicitud aprobada
    const [requests] = await db.query(
      "SELECT * FROM password_reset_requests WHERE user_id = ? AND status = 'approved' ORDER BY approved_at DESC LIMIT 1",
      [realUserId]
    );
    if (!requests.length) return res.status(403).json({ success: false, message: 'No approved request' });
    // Cambiar contraseña
    const hashed = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, realUserId]);
    // Marcar solicitud como usada
    await db.query('UPDATE password_reset_requests SET status = "used", used_at = NOW() WHERE id = ?', [requests[0].id]);
    res.json({ success: true });
  } catch (err) {
    // DEBUG: Eliminar este log después de depurar
    console.error('RESET_PASSWORD_ERROR:', err);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};
// passwordResetController.js
const db = require('../db');

// POST /api/auth/password-requests
exports.createRequest = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(200).json({ success: true, message: 'Request received' });
  try {
    // Verificar si el usuario existe
    const [users] = await db.query('SELECT id FROM users WHERE id = ? OR username = ?', [user_id, user_id]);
    if (!users.length) {
      // Siempre responder igual aunque no exista
      return res.status(200).json({ success: true, message: 'Request received' });
    }
    const realUserId = users[0].id;
    // No permitir nueva solicitud si hay una pendiente o aprobada sin expirar
    const [existing] = await db.query(
      "SELECT * FROM password_reset_requests WHERE user_id = ? AND (status = 'pending' OR status = 'approved')",
      [realUserId]
    );
    if (existing.length > 0) {
      return res.status(200).json({ success: true, message: 'Request received' });
    }
    await db.query(
      'INSERT INTO password_reset_requests (user_id) VALUES (?)',
      [realUserId]
    );
    res.status(200).json({ success: true, message: 'Request received' });
  } catch (err) {
    res.status(200).json({ success: true, message: 'Request received' });
  }
};

// GET /api/auth/password-requests
exports.getRequests = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.username FROM password_reset_requests r JOIN users u ON r.user_id = u.id ORDER BY r.requested_at DESC`
    );
    res.json({ success: true, requests: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get requests' });
  }
};

// PATCH /api/auth/password-requests/:id/approve
exports.approveRequest = async (req, res) => {
  const { id } = req.params;
  const admin_id = req.user?.id; // requiere autenticación admin
  try {
    const [result] = await db.query(
      `UPDATE password_reset_requests SET status = 'approved', approved_at = NOW(), admin_id = ? WHERE id = ? AND status = 'pending'`,
      [admin_id, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found or already processed' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to approve request' });
  }
};

// PATCH /api/auth/password-requests/:id/reject
exports.rejectRequest = async (req, res) => {
  const { id } = req.params;
  const admin_id = req.user?.id;
  try {
    const [result] = await db.query(
      `UPDATE password_reset_requests SET status = 'rejected', rejected_at = NOW(), admin_id = ? WHERE id = ? AND status = 'pending'`,
      [admin_id, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found or already processed' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reject request' });
  }
};

// GET /api/auth/password-requests/status/:user_id_or_username
exports.getStatus = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Buscar el id real si se pasa username
    let realUserId = user_id;
    if (isNaN(Number(user_id))) {
      const [users] = await db.query('SELECT id FROM users WHERE username = ?', [user_id]);
      if (!users.length) return res.json({ success: true, status: 'none' });
      realUserId = users[0].id;
    }
    const [rows] = await db.query(
      `SELECT status FROM password_reset_requests WHERE user_id = ? ORDER BY requested_at DESC LIMIT 1`,
      [realUserId]
    );
    res.json({ success: true, status: rows[0]?.status || 'none' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get status' });
  }
};
