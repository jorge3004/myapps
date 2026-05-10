// userService.js
// Servicio para manejar autenticación y usuario actual
import apiService from './apiService';

const TOKEN_KEY = 'token';

const userService = {
  async login(username, password) {
    const data = await apiService.login({ username, password });
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } else if (data.require_password_change && data.user) {
      // Permitir flujo especial de primer login
      return data;
    } else {
      throw new Error(data.message || 'Login fallido');
    }
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
  // Puedes agregar más métodos aquí (getCurrentUser, isAuthenticated, etc.)
};

export default userService;
