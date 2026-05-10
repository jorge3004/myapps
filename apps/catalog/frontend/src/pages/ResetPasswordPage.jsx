import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import { resetPassword } from '../api/passwordResetApi';
import { Box, Typography, Alert, Button } from '@mui/material';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get('user_id');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (password) => {
    setLoading(true);
    setError(null);
    try {
      if (!user_id) throw new Error('No user_id provided');
      const res = await resetPassword({ user_id, password });
      if (!res.success) throw new Error(res.message || 'Error resetting password');
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Alert severity="success">Contraseña cambiada correctamente.</Alert>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} href="/login">
          Ir al login
        </Button>
      </Box>
    );
  }

  return (
    <ResetPasswordForm onSubmit={handleReset} loading={loading} error={error} />
  );
};

export default ResetPasswordPage;
