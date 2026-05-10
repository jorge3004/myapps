import React, { createContext, useContext } from 'react';
import useThemeSwitcher from '../hooks/userSession/useThemeSwitcher';

export const ThemeContext = createContext();

export function ThemeProviderCustom({ children }) {
    const { theme, toggleTheme } = useThemeSwitcher();
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);
}