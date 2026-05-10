// backend/controllers/user/approvalController.js
const pool = require('../../db');
const { createNotification } = require('../../utils/notification');

/**
 * Aprobar usuario: cambia status a 'active', guarda approved_by y approved_at, y notifica al usuario
 * Solo para administradores
 */
exports.approveUser = async (req, res) => {
    const { id } = req.params; // id del usuario a aprobar
    const adminId = req.user.id;
    try {
        // Verificar que el usuario existe y está pendiente
        const [rows] = await pool.execute('SELECT id, status FROM users WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (rows[0].status !== 'pending') {
            return res.status(400).json({ success: false, message: 'User is not pending approval' });
        }
        // Aprobar usuario
        await pool.execute(
            'UPDATE users SET status = ?, approved_by = ?, approved_at = NOW() WHERE id = ?',
            ['active', adminId, id]
        );
        // Notificar al usuario
        await createNotification({
            user_id: id,
            type: 'approval',
            message: 'Your account has been approved. You can now log in.',
            link: '/login',
        });
        res.json({ success: true, message: 'User approved and notified' });
    } catch (err) {
        console.error('Aprobar usuario error:', err);
        res.status(500).json({ success: false, message: 'Failed to approve user' });
    }
};
