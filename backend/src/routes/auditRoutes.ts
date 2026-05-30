import { Router } from 'express';
import { getAuditLogs } from '../audit/auditLog';

const router = Router();

// GET /api/audit-logs
router.get('/', (req, res) => {
  const logs = getAuditLogs();
  res.json(logs);
});

export default router;
