import { createTheme } from '@mui/material/styles';


// Paleta fiel a https://merisa.mx/
const merisaPalette = {
    primary: {
        main: '#1e2a36', // Azul oscuro principal
        contrastText: '#fff',
    },
    secondary: {
        main: '#223047', // Azul más claro para acentos
        contrastText: '#fff',
    },
    background: {
        default: '#f5f6fa', // Fondo general
        paper: '#fff',
    },
    text: {
        primary: '#1e2a36', // Azul oscuro para textos principales
        secondary: '#6c757d', // Gris medio para textos secundarios
    },
    divider: '#e0e3e7', // Gris claro para divisores
    info: {
        main: '#2b3a4a', // Azul acento (hover, detalles)
        contrastText: '#fff',
    },
    error: {
        main: '#d32f2f',
    },
    warning: {
        main: '#fbc02d',
    },
    success: {
        main: '#388e3c',
    },
};

const defaultTheme = createTheme({
    palette: merisaPalette,
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 600 },
        h3: { fontWeight: 500 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
});

const altTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#1e2a36', contrastText: '#fff' }, // Azul Merisa
        secondary: { main: '#223047', contrastText: '#fff' }, // Azul acento Merisa
        background: { default: '#181a20', paper: '#23263a' },
        text: { primary: '#fff', secondary: '#b0b0b0' },
        divider: '#2b3a4a',
        info: { main: '#2b3a4a', contrastText: '#fff' },
        error: { main: '#ef5350' },
        warning: { main: '#fbc02d' },
        success: { main: '#66bb6a' },
    },
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif',
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    backgroundColor: '#1e2a36',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: '#223047',
                    },
                },
            },
        },
    },
});

export const themes = {
    light: defaultTheme,
    dark: altTheme,
};
