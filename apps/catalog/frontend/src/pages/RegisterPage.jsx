import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { Box, Paper } from '@mui/material';

const RegisterPage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
    }}
  >
    <Paper elevation={3} sx={{ p: 4, width: 1, maxWidth: 420 }}>
      <RegisterForm />
    </Paper>
  </Box>
);

export default RegisterPage;
