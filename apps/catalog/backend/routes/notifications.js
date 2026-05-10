// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../controllers/user/authController');

// GET /api/notifications - Obtener notificaciones del usuario autenticado
router.get('/', verifyToken, notificationController.getMyNotifications);

// PATCH /api/notifications/:id/read - Marcar notificación como leída
router.patch('/:id/read', verifyToken, notificationController.markAsRead);

module.exports = router;
