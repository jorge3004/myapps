import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../api/userApi';

const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [preferredName, setPreferredName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedUsername, setGeneratedUsername] = useState('');

  // No cambiar idioma aquí, se usa el global de i18n
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const result = await registerUser({
        preferred_name: preferredName,
        last_name: lastName,
        password,
      });
      setSuccess('¡Registro exitoso!');
      setGeneratedUsername(result.username);
      setPreferredName('');
      setLastName('');
      setPassword('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}
    >
      <Typography variant="h5" mb={2}>
        {t('register.title', 'Register')}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t(error)}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Registro exitoso!
          <br />
          {generatedUsername && (
            <>
              Tu nombre de usuario es: <b>{generatedUsername}</b>
              <br />
            </>
          )}
          Un administrador debe aprobar tu cuenta antes de poder ingresar al
          sistema.
        </Alert>
      )}
      {!success && (
        <>
          <TextField
            label={t('register.preferredName', 'Preferred Name')}
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label={t('register.lastName', 'Last Name')}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label={t('register.password', 'Password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading
              ? t('register.loading', 'Registering...')
              : t('register.button', 'Register')}
          </Button>
        </>
      )}
      {/* Solo mostrar el link de abajo, no el botón duplicado */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <MuiLink
          component={Link}
          to="/login"
          sx={{
            color: (theme) =>
              theme.palette.mode === 'dark'
                ? '#90caf9'
                : theme.palette.primary.main,
            fontSize: 16,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {t('register.backToLogin')}
        </MuiLink>
      </Box>
    </Box>
  );
};

export default RegisterForm;
