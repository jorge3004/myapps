// backend/utils/notification.js
// Utilidad para crear notificaciones en la base de datos

const pool = require('../db');

/**
 * Crea una notificación para un usuario
 * @param {Object} options
 * @param {number} options.user_id - ID del usuario destinatario
 * @param {string} options.type - Tipo de notificación ('approval', 'password_reset', etc.)
 * @param {string} options.message - Mensaje de la notificación
 * @param {string} [options.link] - Enlace opcional relacionado
 */
async function createNotification({ user_id, type, message, link = null }) {
    const sql = `INSERT INTO notifications (user_id, type, message, link) VALUES (?, ?, ?, ?)`;
    await pool.query(sql, [user_id, type, message, link]);
}

module.exports = {
    createNotification,
};
