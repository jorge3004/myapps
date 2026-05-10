import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

const ForgotPasswordForm = ({ onSubmit, loading, error }) => {
  const [username, setUsername] = useState('');
  return (
    <Box component="form" onSubmit={e => { e.preventDefault(); onSubmit(username); }} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Recuperar contraseña</Typography>
      <TextField
        label="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Solicitar cambio'}
      </Button>
    </Box>
  );
};

export default ForgotPasswordForm;
