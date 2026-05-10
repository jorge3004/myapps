import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoginLinks from './LoginLinks';
import useLogin from '../../hooks/userSession/useLogin';
import userService from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// ...existing code...


const LoginForm = ({ userParam }) => {
  const { t } = useTranslation();
  const { login, loading, error, requirePasswordChange, tempUser } = useLogin();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState(userParam || '');
  const [password, setPassword] = React.useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeError, setChangeError] = useState(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const passwordRef = React.useRef();

  React.useEffect(() => {
    if (userParam) {
      setUsername(userParam);
      // Enfoca el campo de contraseña si el usuario viene prellenado
      setTimeout(() => {
        if (passwordRef.current) passwordRef.current.focus();
      }, 100);
    }
  }, [userParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  // Validación en tiempo real de contraseñas
  React.useEffect(() => {
    if (!confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(newPassword === confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  // Handler para cambio de contraseña en primer login
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangeError(null);
    if (!newPassword || newPassword.length < 6) {
      setChangeError(t('login.passwordTooShort', 'Password must be at least 6 characters long'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError(t('login.passwordsDontMatch', 'Passwords do not match'));
      return;
    }
    // Llamar endpoint PATCH /api/users/:id/password
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_BASE_URL}/users/${tempUser.id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: '123456', next: newPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to change password');
      // Login automático tras cambio exitoso
      try {
        await userService.login(tempUser.username, newPassword);
        navigate('/dashboard');
      } catch (loginErr) {
        setChangeError(t('login.autoLoginFailed', 'Password changed, but automatic login failed. Please login manually.'));
      }
    } catch (err) {
      setChangeError(err.message);
    }
  };
  if (requirePasswordChange && tempUser) {
    // Mostrar formulario de cambio de contraseña
    return (
      <Box
        component="form"
        onSubmit={handleChangePassword}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 400,
          mx: 'auto',
          mt: { xs: 4, sm: 10 },
          mb: { xs: 4, sm: 10 },
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 5 },
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: { xs: 0, sm: 6 },
          transition: 'box-shadow 0.3s, padding 0.3s',
        }}
      >
        <Typography variant="h5" align="center">
          {t('login.setNewPassword', 'Set your new password')}
        </Typography>
        <TextField
          label={t('login.newPassword', 'New password')}
          type="password"
          variant="outlined"
          fullWidth
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label={t('login.confirmPassword', 'Confirm password')}
          type="password"
          variant="outlined"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!passwordsMatch}
          helperText={!passwordsMatch ? t('login.passwordsDontMatch', 'Passwords do not match') : ''}
        />
        {changeError && (
          <Typography color="error" align="center">
            {changeError}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading || !passwordsMatch}
        >
          {loading ? t('login.loading', 'Cambiando...') : t('login.setPasswordButton', 'Set password')}
        </Button>
      </Box>
    );
  }

  // Formulario de login normal
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        mt: { xs: 4, sm: 10 },
        mb: { xs: 4, sm: 10 },
        px: { xs: 2, sm: 4 },
        py: { xs: 3, sm: 5 },
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: { xs: 0, sm: 6 },
        transition: 'box-shadow 0.3s, padding 0.3s',
      }}
    >
      <Typography variant="h5" align="center">
        {t('login.title')}
      </Typography>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      <TextField
        label={t('login.username', 'Usuario')}
        variant="outlined"
        fullWidth
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputLabelProps={{
          sx: (theme) => ({
            color:
              theme.palette.mode === 'dark'
                ? '#fff'
                : theme.palette.text.primary,
            background: 'transparent',
            zIndex: 1,
            '&.Mui-focused': {
              color:
                theme.palette.mode === 'dark'
                  ? '#90caf9'
                  : theme.palette.secondary.main,
            },
            '&.MuiInputLabel-shrink': {
              color:
                theme.palette.mode === 'dark'
                  ? '#90caf9'
                  : theme.palette.secondary.main,
            },
          }),
        }}
        inputProps={{
          sx: (theme) => ({
            color:
              theme.palette.mode === 'dark'
                ? '#fff'
                : theme.palette.text.primary,
          }),
        }}
      />
      <TextField
        label={t('login.password')}
        type="password"
        variant="outlined"
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        inputRef={passwordRef}
        InputLabelProps={{
          sx: (theme) => ({
            color:
              theme.palette.mode === 'dark'
                ? '#fff'
                : theme.palette.text.primary,
            background: 'transparent',
            zIndex: 1,
            '&.Mui-focused': {
              color:
                theme.palette.mode === 'dark'
                  ? '#90caf9'
                  : theme.palette.secondary.main,
            },
            '&.MuiInputLabel-shrink': {
              color:
                theme.palette.mode === 'dark'
                  ? '#90caf9'
                  : theme.palette.secondary.main,
            },
          }),
        }}
        inputProps={{
          sx: (theme) => ({
            color:
              theme.palette.mode === 'dark'
                ? '#fff'
                : theme.palette.text.primary,
          }),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
      >
        {loading ? t('login.loading', 'Cargando...') : t('login.loginButton')}
      </Button>
      <LoginLinks />
    </Box>
  );
};

export default LoginForm;
