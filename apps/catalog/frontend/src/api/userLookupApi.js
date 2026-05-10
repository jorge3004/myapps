// API para buscar user_id a partir de username
import apiService from '../services/apiService';

export const getUserIdByUsername = async (username) => {
  // Suponiendo que existe un endpoint real, si no, simular
  const res = await apiService.get(`/users/lookup/${encodeURIComponent(username)}`);
  return res.user_id;
};
