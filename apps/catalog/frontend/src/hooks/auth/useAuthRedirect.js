import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateDashboardRoute } from '../../utils/route/validateDashboardRoute';

// Hook simple para redirección basada en sesión y last_route
export default function useSimpleAuthRedirect() {
    const { hasSession, authErrorReason } = useAuth();
    const location = useLocation();

    const PUBLIC_ROUTES = ['/login', '/register', '/forgot', '/reset-password'];
    const isPublicRoute = PUBLIC_ROUTES.some((p) =>
        location.pathname === p || location.pathname.startsWith(p + '/')
    );

    // Si no hay sesión y está en ruta privada, redirigir a login
    if (!hasSession && !isPublicRoute) {
        let reason = '';
        if (authErrorReason === 'invalid-token') reason = 'invalid';
        else if (authErrorReason === 'no-token') reason = 'none';
        const url = reason ? `/login?session=${reason}` : '/login';
        return <Navigate to={url} replace />;
    }

    // Si hay sesión
    if (hasSession) {
        // Calcula la ruta privada válida (si la hay)
        const validPrivateRoute = validateDashboardRoute(location.pathname);
        // Si la ruta actual no es privada válida, redirige a la última ruta válida o dashboard
        if (location.pathname !== validPrivateRoute) {
            let lastRoute = localStorage.getItem('last_route') || '/dashboard';
            const target = validateDashboardRoute(lastRoute) || '/dashboard';
            if (location.pathname !== target) {
                return <Navigate to={target} replace />;
            }
        }
    }

    return null;
}
