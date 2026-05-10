import { useState } from 'react';
import userService from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import { validateDashboardRoute } from '../../utils/route/validateDashboardRoute';
import useApplyUserSession from '../auth/useSessionManager';
import { useTranslation } from 'react-i18next';
const useLogin = () => {
    const { applyUserSession } = useApplyUserSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [requirePasswordChange, setRequirePasswordChange] = useState(false);
    const [tempUser, setTempUser] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        setRequirePasswordChange(false);
        setTempUser(null);
        try {
            const result = await userService.login(username, password);
            if (result && result.token && result.user) {
                // Si el backend devuelve un idioma, sincronizarlo
                if (result.user.language) {
                    localStorage.setItem('lang', result.user.language);
                    if (typeof window !== 'undefined' && window.i18n) {
                        window.i18n.changeLanguage(result.user.language);
                    }
                }
                applyUserSession(result.user, { setLastRoute: true, authOrigin: 'login' });
            } else if (result && result.require_password_change && result.user) {
                setRequirePasswordChange(true);
                setTempUser(result.user);
                // No aplicar sesión aún, esperar cambio de contraseña
            } else {
                setError(t('login.invalidServerResponse', 'Invalid server response'));
                return null;
            }
        } catch (err) {
            // Mensaje específico para cuenta pendiente
            const msg = err.message ? err.message.toLowerCase() : '';
            if (msg.includes('not yet been approved')) {
                setError(t('login.notApproved', 'Your account has not yet been approved by an administrator.'));
            } else if (msg.includes('deactivated')) {
                setError(t('login.deactivated', 'Your account has been deactivated. Please contact an administrator.'));
            } else if (msg.includes('user does not exist')) {
                setError(t('login.userNotFound', 'User does not exist'));
            } else if (msg.includes('incorrect password')) {
                setError(t('login.incorrectPassword', 'Incorrect password'));
            } else if (msg.includes('invalid credentials') || msg.includes('credenciales')) {
                setError(t('login.invalidCredentials'));
            } else {
                setError(err.message || t('login.error'));
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error, requirePasswordChange, tempUser };
};

export default useLogin;
