// API para forgot password (mock, reemplazar con fetch real)

let mockRequests = [
  { id: 1, username: 'usuario1', status: 'pending', createdAt: '2026-04-27' },
  { id: 2, username: 'usuario2', status: 'approved', createdAt: '2026-04-26' },
];

const forgotPasswordApi = {
  async getRequests() {
    // Simulación: fetch('/api/auth/password-requests')
    return { requests: mockRequests };
  },
  async approveRequest(id) {
    // Simulación: fetch(`/api/auth/password-requests/${id}/approve`, { method: 'POST' })
    mockRequests = mockRequests.map(r => r.id === id ? { ...r, status: 'approved' } : r);
    return { ok: true };
  },
  async rejectRequest(id) {
    // Simulación: fetch(`/api/auth/password-requests/${id}/reject`, { method: 'POST' })
    mockRequests = mockRequests.map(r => r.id === id ? { ...r, status: 'rejected' } : r);
    return { ok: true };
  },
  async checkStatus(username) {
    // Simulación: fetch(`/api/auth/forgot-password/status?username=${username}`)
    // return { status: 'pending' | 'approved' | 'rejected' | 'none' }
    return { status: 'pending' };
  },
  async requestReset(username) {
    // Simulación: fetch(`/api/auth/forgot-password`, { method: 'POST', body: JSON.stringify({ username }) })
    // Si ya hay una solicitud pendiente para este usuario, no agregar otra
    const exists = mockRequests.some(r => r.username === username && r.status === 'pending');
    if (!exists) {
      mockRequests.push({
        id: mockRequests.length ? Math.max(...mockRequests.map(r => r.id)) + 1 : 1,
        username,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      });
    }
    return { ok: true };
  },
  async resetPassword(username, password) {
    // Simulación: fetch(`/api/auth/reset-password`, { method: 'POST', body: JSON.stringify({ username, password }) })
    // return { ok: true }
    if (!username || !password) throw new Error('Datos incompletos');
    return { ok: true };
  },
};

export default forgotPasswordApi;
