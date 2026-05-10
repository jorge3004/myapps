import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../../../../context/ThemeContext';

const ThemeSelector = () => {
    const { theme, toggleTheme } = useThemeContext();
    const isLight = theme === 'light';
    return (
        <IconButton
            onClick={toggleTheme}
            sx={{
                color: isLight ? '#222' : '#FFD600',
                backgroundColor: 'transparent',
                transition: 'color 0.2s',
            }}
            aria-label={isLight ? 'Activar modo oscuro' : 'Activar modo claro'}
        >
            {isLight ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
    );
};

export default ThemeSelector;
