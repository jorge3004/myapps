import React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LoginLinks = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <MuiLink
        component={Link}
        to="/forgot"
        sx={(theme) => ({
          color:
            theme.palette.mode === 'dark'
              ? '#90caf9'
              : theme.palette.secondary.main,
          fontWeight: 500,
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        })}
      >
        {t('login.forgot')}
      </MuiLink>
      <MuiLink
        component={Link}
        to="/register"
        sx={(theme) => ({
          color:
            theme.palette.mode === 'dark'
              ? '#90caf9'
              : theme.palette.secondary.main,
          fontWeight: 500,
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        })}
      >
        {t('login.register')}
      </MuiLink>
    </Box>
  );
};

export default LoginLinks;
