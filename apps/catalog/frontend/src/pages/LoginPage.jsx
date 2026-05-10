import React from 'react';
import LoginForm from '../components/login/LoginForm';
import { Box, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionParam = params.get('session');
  let sessionMsg = '';
  if (sessionParam === 'invalid') {
    sessionMsg = 'Your session has expired or is invalid. Please log in again.';
  }
  // Si quieres mostrar un mensaje especial para no-token, puedes agregarlo aquí
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 2, sm: 0 },
        bgcolor: 'background.default',
      }}
    >
      {sessionMsg && (
        <Alert severity="warning" sx={{ mb: 2, maxWidth: 400 }}>
          {sessionMsg}
        </Alert>
      )}
      <LoginForm userParam={params.get('user')} />
    </Box>
  );
};

export default Login;
