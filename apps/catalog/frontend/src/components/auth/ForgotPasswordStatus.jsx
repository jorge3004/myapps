import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForgotPasswordStatus = ({ status, onRetry, onReset }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  let content;
  switch (status) {
    case 'pending':
      content = <Alert severity="info">{t('forgot.status.pending')}</Alert>;
      break;
    case 'approved':
      content = (
        <>
          <Alert severity="success">{t('forgot.status.approved')}</Alert>
          <Button variant="contained" color="primary" onClick={onReset} sx={{ mt: 2 }}>
            {t('forgot.status.changePassword')}
          </Button>
        </>
      );
      break;
    case 'rejected':
      content = <Alert severity="error">{t('forgot.status.rejected')}</Alert>;
      break;
    case 'cancelled':
      content = <Alert severity="warning">{t('forgot.status.cancelled')}</Alert>;
      break;
    case 'none':
    default:
      content = <Alert severity="info">{t('forgot.status.none')}</Alert>;
      break;
  }
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>{t('forgot.status.title')}</Typography>
      {content}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={onRetry}>
          {t('forgot.status.newRequest')}
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/login')}>
          {t('forgot.status.goToLogin')}
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPasswordStatus;
