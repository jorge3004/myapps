import React from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LanguageSelector from './LanguageSelector';
import ChangePasswordForm from './ChangePasswordForm';
import { useTranslation } from 'react-i18next';
import ThemeSelector from './ThemeSelector';

const ProfileModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const muiTheme = useTheme();
  // ...existing code...

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      scroll="body"
      PaperProps={{
        sx: {
          borderRadius: 0,
          p: { xs: 0, sm: 2 },
          position: 'relative',
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          boxShadow: 0,
          backgroundColor: 'rgba(255,255,255,0.05)',
          backdropFilter: 'none',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.35)',
          backdropFilter: 'none',
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          zIndex: 10,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      <Box
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 4,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h5">
            {t('profile.title', 'Perfil de Usuario')}
          </Typography>

          <ThemeSelector />

        </Box>
        <Divider sx={{ my: 2 }} />
        <LanguageSelector />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {t('profile.changePassword', 'Cambiar contraseña')}
        </Typography>
        <ChangePasswordForm />
      </Box>
    </Dialog>
  );
};

export default ProfileModal;
