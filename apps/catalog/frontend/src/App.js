import React, { useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { themes } from './theme';
import AppWithAuthLoader from './AppWithAuthLoader';
import { AuthProvider } from './context/AuthContext';
import './i18n';
import { useTranslation } from 'react-i18next';
import './global.css';
import { useThemeContext, ThemeProviderCustom } from './context/ThemeContext';

function App() {
    const { i18n } = useTranslation();

    useEffect(() => {
        if (i18n.language === 'en') {
            document.title = 'Hospital Equipment Catalog';
        } else {
            document.title = 'Catálogo de Aparatos Hospitalarios';
        }
    }, [i18n.language]);

    return (
        <ThemeProviderCustom>
            <ThemeProviderWrapper>
                <CssBaseline />
                <AuthProvider>
                    <BrowserRouter>
                        <AppWithAuthLoader />
                    </BrowserRouter>
                </AuthProvider>
            </ThemeProviderWrapper>
        </ThemeProviderCustom>
    );
}

// Wrapper para conectar ThemeProvider de MUI con theme del contexto

function ThemeProviderWrapper({ children }) {
    const { theme } = useThemeContext();
    const muiTheme = useMemo(() => themes[theme], [theme]);
    return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}

export default App;
