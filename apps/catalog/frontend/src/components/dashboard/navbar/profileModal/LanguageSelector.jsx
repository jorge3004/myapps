import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [lang, setLang] = React.useState(
    () => localStorage.getItem('lang') || i18n.language,
  );

  const handleChange = async (event) => {
    const newLang = event.target.value;
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    i18n.changeLanguage(newLang);
    // Si el usuario está autenticado, sincroniza con backend
    const token = localStorage.getItem('token');
    if (user && user.id && token) {
      try {
        const API_URL = process.env.REACT_APP_API_URL || '/api';
        await fetch(`${API_URL}/users/${user.id}/language`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ language: newLang }),
        });
      } catch (err) {
        // Silenciar error
      }
    }
  };

  React.useEffect(() => {
    if (
      localStorage.getItem('lang') &&
      localStorage.getItem('lang') !== i18n.language
    ) {
      i18n.changeLanguage(localStorage.getItem('lang'));
    }
  }, [i18n]);

  return (
    <FormControl size="small" sx={{ minWidth: 120, mb: 2 }}>
      <InputLabel id="lang-label">Idioma</InputLabel>
      <Select
        labelId="lang-label"
        value={lang}
        label="Idioma"
        onChange={handleChange}
      >
        <MenuItem value="es">Español</MenuItem>
        <MenuItem value="en">English</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
