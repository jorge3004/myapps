// apiService.js
// Servicio base para peticiones HTTP a la API backend

const API_BASE_URL = process.env.REACT_APP_API_URL;
if (!API_BASE_URL) {
  throw new Error('REACT_APP_API_URL no está definida en el entorno. Por favor, configura la variable en tu archivo .env del frontend.');
}

const apiService = {
  async login({ username, password }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (!response.ok) {
      // Si el backend manda un mensaje, úsalo
      throw new Error(data.message || 'Authentication error');
    }
    return data;
  },

  async post(path, body) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      let msg = 'Request failed';
      try {
        const data = await response.json();
        msg = data.message || msg;
      } catch { }
      if (response.status === 404 || msg.toLowerCase().includes('not found')) {
        msg = 'User not found';
      }
      if (response.status === 400 && msg.toLowerCase().includes('user')) {
        msg = 'Invalid user';
      }
      throw new Error(msg);
    }
    return response.json();
  },

  async get(path) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${path}`, { headers });
    if (!response.ok) {
      let msg = 'Request failed';
      try {
        const data = await response.json();
        msg = data.message || msg;
      } catch { }
      throw new Error(msg);
    }
    return response.json();
  },

  async patch(path, body) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      let msg = 'Request failed';
      try {
        const data = await response.json();
        msg = data.message || msg;
      } catch { }
      throw new Error(msg);
    }
    return response.json();
  },
};

export default apiService;
