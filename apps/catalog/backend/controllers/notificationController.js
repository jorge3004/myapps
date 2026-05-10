// backend/controllers/notificationController.js
const pool = require('../db');

// Obtener notificaciones de un usuario autenticado
exports.getMyNotifications = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, type, message, read, created_at, link FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json({ success: true, notifications: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get notifications' });
    }
};

// Marcar notificación como leída
exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute(
            'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to mark notification' });
    }
};
