// Hook/utilidad para centralizar la activación y desactivación de sesión de usuario
import { useAuth } from '../../context/AuthContext';
import { setUserLocalStorage, clearLocalStorageExcept } from '../../utils/auth/authHelpers';

// Permite usar setters externos (para evitar ciclo en AuthProvider) o contexto por defecto
export default function useApplyUserSession(
    setters = null
) {
    // Si se pasan setters explícitos, úsalos; si no, usa el contexto
    const context = useAuth();
    const {
        setUser,
        setHasSession,
        setAuthErrorReason,
        setAuthOrigin
    } = setters || context || {};

    // Activa la sesión de usuario
    function applyUserSession(user, origin = 'token') {
        if (!setUser || !setHasSession || !setAuthErrorReason || !setAuthOrigin) return;
        setUser(user);
        setUserLocalStorage(user);
        setHasSession(true);
        setAuthErrorReason(null);
        setAuthOrigin(origin);
    }

    // Desactiva la sesión de usuario
    function clearUserSession() {
        if (!setUser || !setHasSession || !setAuthErrorReason || !setAuthOrigin) return;
        setUser(null);
        setHasSession(false);
        setAuthErrorReason('no-token');
        setAuthOrigin(null);
        clearLocalStorageExcept(['lang', 'theme']);
    }

    return { applyUserSession, clearUserSession };
}
