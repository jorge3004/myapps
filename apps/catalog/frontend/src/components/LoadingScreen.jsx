import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = ({ message = 'Cargando...' }) => (
    <Box
        sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            gap: 2,
        }}
    >
        <CircularProgress color="primary" />
        <Typography variant="h6" color="text.secondary">{message}</Typography>
    </Box>
);

export default LoadingScreen;
