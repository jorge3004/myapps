import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

const ForgotPasswordStatus = ({ status, onRetry, onReset }) => {
  let content;
  switch (status) {
    case 'pending':
      content = <Alert severity="info">Tu solicitud está pendiente de autorización del administrador.</Alert>;
      break;
    case 'approved':
      content = (
        <>
          <Alert severity="success">Tu solicitud fue aprobada. Puedes cambiar tu contraseña.</Alert>
          <Button variant="contained" color="primary" onClick={onReset} sx={{ mt: 2 }}>
            Cambiar contraseña
          </Button>
        </>
      );
      break;
    case 'rejected':
      content = <Alert severity="error">Tu solicitud fue rechazada. Contacta al administrador o reintenta.</Alert>;
      break;
    case 'none':
    default:
      content = <Alert severity="info">No hay solicitud activa. Puedes solicitar un cambio.</Alert>;
      break;
  }
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Estado de recuperación</Typography>
      {content}
      {status === 'rejected' || status === 'none' ? (
        <Button variant="outlined" color="primary" onClick={onRetry} sx={{ mt: 2 }}>
          Nueva solicitud
        </Button>
      ) : null}
    </Box>
  );
};

export default ForgotPasswordStatus;
