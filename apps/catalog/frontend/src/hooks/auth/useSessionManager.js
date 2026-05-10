// Hook unificado para gestión de sesión de usuario (contexto o setters explícitos)
import { useAuth } from '../../context/AuthContext';
import { setUserLocalStorage, clearLocalStorageExcept } from '../../utils/auth/authHelpers';

export default function useSessionManager(setters = null) {
    // Usa setters explícitos si se pasan, si no usa el contexto
    const context = useAuth();
    const {
        setUser,
        setHasSession,
        setAuthErrorReason,
        setAuthOrigin
    } = setters || context || {};

    // Activa la sesión de usuario (login, token, etc)
    function applyUserSession(user, options = {}) {
        setUserLocalStorage(user || {});
        setUser(user);
        setHasSession(true);
        setAuthOrigin(options.authOrigin || 'login');
        // Solo setear last_route si options.setLastRoute es true
        if (options.setLastRoute) {
            localStorage.setItem('last_route', user?.last_route || '/dashboard');
        }
    }

    // Desactiva la sesión de usuario
    function clearUserSession() {
        // function clearUserSession(reason = 'no-token') {
        // if (
        //     typeof setUser !== 'function' ||
        //     typeof setHasSession !== 'function' ||
        //     typeof setAuthErrorReason !== 'function' ||
        //     typeof setAuthOrigin !== 'function'
        // ) {
        //     throw new Error('Faltan setters requeridos para la sesión.');
        // }
        setUser(null);
        setHasSession(false);
        // setAuthErrorReason(reason);
        setAuthOrigin(null);
        clearLocalStorageExcept(['lang', 'theme']);
    }

    return { applyUserSession, clearUserSession };
}
