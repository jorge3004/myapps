
// routes/auth/passwordReset.js
const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/passwordResetController');
const { requireAdmin, requireAuth } = require('../../middleware/auth');
// Cambiar contraseña tras aprobación
router.post('/password-requests/reset-password', ctrl.resetPassword);

// Crear solicitud (usuario no autenticado)
router.post('/password-requests', ctrl.createRequest);
// Listar solicitudes (admin)
router.get('/password-requests', requireAdmin, ctrl.getRequests);
// Aprobar solicitud (admin)
router.patch('/password-requests/:id/approve', requireAdmin, ctrl.approveRequest);
// Rechazar solicitud (admin)
router.patch('/password-requests/:id/reject', requireAdmin, ctrl.rejectRequest);
// Consultar status de solicitud (sin autenticación)
router.get('/password-requests/status/:user_id', ctrl.getStatus);

module.exports = router;
