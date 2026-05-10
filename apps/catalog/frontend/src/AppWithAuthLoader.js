import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';
import { Box, Alert, Typography } from '@mui/material';
import LoadingScreen from './components/LoadingScreen';
import { useTranslation } from 'react-i18next';


const CONNECTION_ERROR_KEY = 'app.connectionError';


const AppWithAuthLoader = () => {
    const { loading, apiError, apiErrorMsg } = useAuth();
    const { t, i18n } = useTranslation();

    // Detect if the error is the connection error and translate if needed
    let displayErrorMsg = apiErrorMsg;
    if (
        apiErrorMsg === 'Could not connect to the server. Please check your connection or contact the administrator.'
    ) {
        displayErrorMsg = t(CONNECTION_ERROR_KEY);
    }

    if (loading) {
        return <LoadingScreen message={t('auth.loading', 'Loading authentication...')} />;
    }
    if (apiError) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
                <Alert severity="error" sx={{ mb: 2, maxWidth: 400, width: '100%' }}>
                    <Typography variant="h6" gutterBottom>{t('Error')}</Typography>
                    <Typography variant="body1">{displayErrorMsg}</Typography>
                </Alert>
            </Box>
        );
    }
    return <AppRoutes />;
};

export default AppWithAuthLoader;
