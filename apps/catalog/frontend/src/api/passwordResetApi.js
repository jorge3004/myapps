// Reset password after approval (user)
// Recibe un objeto: { user_id, password } o { username, password }
export const resetPassword = (data) =>
    apiService.post('/auth/password-requests/reset-password', data);
// frontend/src/api/passwordResetApi.js
import apiService from '../services/apiService';

// Create a new password reset request (user)
export const createPasswordResetRequest = (user_id) =>
    apiService.post('/auth/password-requests', { user_id });

// Get all password reset requests (admin)
export const getPasswordResetRequests = () =>
    apiService.get('/auth/password-requests');

// Approve a password reset request (admin)
export const approvePasswordResetRequest = (id) =>
    apiService.patch(`/auth/password-requests/${id}/approve`);

// Reject a password reset request (admin)
export const rejectPasswordResetRequest = (id) =>
    apiService.patch(`/auth/password-requests/${id}/reject`);

// Get status of a user's password reset request (user)
export const getPasswordResetStatus = (user_id) =>
    apiService.get(`/auth/password-requests/status/${user_id}`);
