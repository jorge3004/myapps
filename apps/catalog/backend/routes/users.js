const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/users/lookup/:username
router.get('/lookup/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const [users] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (!users.length) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user_id: users[0].id });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to lookup user' });
    }
});

module.exports = router;
const userController = require('../controllers/userController');
const approvalController = require('../controllers/user/approvalController');
// PATCH /api/users/:id/approve - Aprobar usuario (solo admin)
const { isAdmin } = require('../controllers/user/authController');

// PATCH /api/users/:id/last-route - Actualizar la última ruta del usuario autenticado
router.patch('/:id/last-route', userController.verifyToken, async (req, res) => {
    const { id } = req.params;
    const { last_route } = req.body;
    console.log(`[PATCH /api/users/${id}/last-route] Recibido last_route:`, last_route);
    if (!last_route) {
        console.warn(`[PATCH /api/users/${id}/last-route] last_route es requerido`);
        return res.status(400).json({ success: false, message: 'last_route es requerido' });
    }
    // Solo el propio usuario o admin puede cambiar su ruta
    if (parseInt(id) !== req.user.id && req.user.role !== 'admin') {
        console.warn(`[PATCH /api/users/${id}/last-route] No autorizado. req.user.id: ${req.user.id}, req.user.role: ${req.user.role}`);
        return res.status(403).json({ success: false, message: 'No autorizado' });
    }
    try {
        const pool = require('../db');
        const [result] = await pool.execute('UPDATE users SET last_route = ? WHERE id = ?', [last_route, id]);
        // console.log(`[PATCH /api/users/${id}/last-route] DB result:`, result);
        if (result.affectedRows === 0) {
            console.warn(`[PATCH /api/users/${id}/last-route] Usuario no encontrado`);
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, message: 'Ruta actualizada', last_route });
    } catch (err) {
        console.error(`[PATCH /api/users/${id}/last-route] Error:`, err);
        res.status(500).json({ success: false, message: 'Error al actualizar last_route', error: err.message });
    }
});

// PATCH /api/users/:id/role - Cambiar rol de usuario (solo admin)
router.patch('/:id/role', userController.verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Rol inválido' });
    }
    try {
        const pool = require('../db');
        const [result] = await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, message: 'Rol actualizado' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al actualizar rol' });
    }
});
router.patch('/:id/approve', userController.verifyToken, isAdmin, approvalController.approveUser);

// PATCH /api/users/:id/password - Cambiar contraseña del usuario autenticado
// Permitir cambio de contraseña sin token solo para onboarding seguro
router.patch('/:id/password', async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Si hay token, usar el middleware normal
        return userController.verifyToken(req, res, () => userController.changePassword(req, res));
    }
    // Sin token: solo permitir si es primer login seguro
    const { id } = req.params;
    const { current, next: nextPass } = req.body;
    if (!current || !nextPass || nextPass.length < 6) {
        return res.status(400).json({ success: false, message: 'Invalid data' });
    }
    try {
        const pool = require('../db');
        const [rows] = await pool.execute('SELECT password, status, created_by_admin FROM users WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const bcrypt = require('bcryptjs');
        const valid = await bcrypt.compare(current, rows[0].password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Current password incorrect' });
        }
        if (rows[0].status === 'pending' && rows[0].created_by_admin) {
            const hashed = await bcrypt.hash(nextPass, 10);
            await pool.execute('UPDATE users SET password = ?, status = ?, created_by_admin = 0 WHERE id = ?', [hashed, 'active', id]);
            return res.json({ success: true });
        } else {
            return res.status(403).json({ success: false, message: 'Forbidden (token required)' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to change password' });
    }
});

// POST /api/users - Create new user
router.post('/', userController.createUser);

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', userController.verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const pool = require('../db');
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
    }
});

// GET /api/users/me - Get current user (protected)
router.get('/me', userController.verifyToken, userController.getMe);

// GET /api/users/:id - Obtener información de usuario por ID (solo admin)
router.get('/:id', userController.verifyToken, isAdmin, userController.getUserById);

// GET /api/users - Listar solo usuarios activos o pendientes (solo admin)
// GET /api/users?status=active|pending|inactive
router.get('/', userController.verifyToken, isAdmin, async (req, res) => {
    try {
        const pool = require('../db');
        let status = req.query.status;
        let where = '';
        let params = [];
        if (status) {
            if (status === 'all') {
                where = '';
            } else if (['active', 'pending', 'inactive'].includes(status)) {
                where = 'WHERE u.status = ?';
                params.push(status);
            } else {
                return res.status(400).json({ success: false, message: 'Invalid status filter' });
            }
        } else {
            // Default: activos y pendientes
            where = "WHERE u.status IN ('active', 'pending')";
        }
        const [rows] = await pool.execute(`
          SELECT 
            u.id, 
            u.username, 
            u.preferred_name, 
            u.last_name, 
            u.role, 
            u.status, 
            u.approved_by, 
            u.approved_at, 
            u.created_at,
            a.username AS approved_by_username
          FROM users u
          LEFT JOIN users a ON u.approved_by = a.id
          ${where}
        `, params);
        res.json({ success: true, users: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    }
});

// GET /api/users/me - Get current user (protected)
router.get('/me', userController.verifyToken, userController.getMe);

// PATCH /api/users/:id/language - Update user language
router.patch('/:id/language', userController.verifyToken, userController.updateLanguage);

// PATCH /api/users/:id/status - Inactivar usuario (soft delete, solo admin)
router.patch('/:id/status', userController.verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'pending', 'inactive'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status inválido' });
    }
    try {
        const pool = require('../db');
        const [result] = await pool.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, message: 'Status actualizado' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al actualizar status' });
    }
});

module.exports = router;
