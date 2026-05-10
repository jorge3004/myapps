import React, { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../../../../context/AuthContext';
import { changePassword } from '../../../../api/userProfileApi';
import { useTranslation } from 'react-i18next';

const ChangePasswordForm = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!next || next.length < 6) {
      setError(
        t(
          'profile.passwordShort',
          'La nueva contraseña debe tener al menos 6 caracteres.',
        ),
      );
      return;
    }
    if (next !== confirm) {
      setError(t('profile.passwordMismatch', 'Las contraseñas no coinciden.'));
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await changePassword({ userId: user.id, current, next, token });
      setSuccess(
        t('profile.passwordChanged', 'Contraseña actualizada correctamente.'),
      );
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setError(
        err.message ||
        t('profile.passwordChangeError', 'Error al cambiar la contraseña.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TextField
        label={t('profile.currentPassword', 'Contraseña actual')}
        type="password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        required
      />
      <TextField
        label={t('profile.newPassword', 'Nueva contraseña')}
        type="password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        required
      />
      <TextField
        label={t('profile.confirmPassword', 'Confirmar nueva contraseña')}
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading
          ? t('profile.saving', 'Guardando...')
          : t('profile.savePassword', 'Guardar contraseña')}
      </Button>
    </Box>
  );
};

export default ChangePasswordForm;
