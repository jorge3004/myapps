import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserIdByUsername } from '../../api/userLookupApi';

const ForgotPasswordForm = ({ onSubmit, loading, error }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const [localError, setLocalError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    const result = await onSubmit(username);
    if (result && result.success !== false) {
      try {
        const user_id = await getUserIdByUsername(username);
        navigate(`/forgot/${user_id}`);
      } catch (err) {
        setLocalError(t('forgot.form.userNotFound'));
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>{t('forgot.form.title')}</Typography>
      <TextField
        label={t('forgot.form.username')}
        value={username}
        onChange={e => setUsername(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? <CircularProgress size={24} /> : t('forgot.form.submit')}
      </Button>
    </Box>
  );
};

export default ForgotPasswordForm;
