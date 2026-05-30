// Simple in-memory audit log utility
export interface AuditLogEntry {
  timestamp: string;
  actorId: string;
  actorEmail?: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: any;
}

const auditLogs: AuditLogEntry[] = [];

export function logAudit(entry: Omit<AuditLogEntry, 'timestamp'>) {
  auditLogs.push({ ...entry, timestamp: new Date().toISOString() });
}

export function getAuditLogs(filter?: Partial<AuditLogEntry>): AuditLogEntry[] {
  if (!filter) return [...auditLogs];
  return auditLogs.filter(log => {
    return Object.entries(filter).every(([key, value]) => (log as any)[key] === value);
  });
}
