import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

const ResetPasswordForm = ({ onSubmit, loading, error }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) return;
    onSubmit(password);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Cambiar contraseña</Typography>
      <TextField
        label="Nueva contraseña"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Confirmar contraseña"
        type="password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        fullWidth
        margin="normal"
        required
        error={password !== confirm && confirm.length > 0}
        helperText={password !== confirm && confirm.length > 0 ? 'Las contraseñas no coinciden' : ''}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading || password !== confirm || !password}>
        {loading ? <CircularProgress size={24} /> : 'Cambiar contraseña'}
      </Button>
    </Box>
  );
};

export default ResetPasswordForm;
