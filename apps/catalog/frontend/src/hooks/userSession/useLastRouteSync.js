import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateLastRoute } from '../../api/userApi';

/**
 * Custom hook para centralizar la gestión de last_route
 * - Sincroniza localStorage y backend
 * - Expone funciones para actualizar y redirigir
 */
const useLastRouteManager = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, sessionSource } = useAuth();

    // Sincroniza la ruta actual con localStorage y backend
    useEffect(() => {

        if (sessionSource === 'login') return;
        // if (sessionSource === 'login' || sessionSource === null) return;
        // console.log('hola')
        if (user && user.id) {
            // No guardar /login como last_route
            if (location.pathname === '/login') return;
            const prev = localStorage.getItem('last_route');
            if (prev !== location.pathname) {
                localStorage.setItem('last_route', location.pathname);
                if (localStorage.getItem('token')) {
                    updateLastRoute({ userId: user.id, last_route: location.pathname, token: localStorage.getItem('token') });
                }
            }
        }
    }, [location.pathname, user, sessionSource]);

    // // Permite actualizar la last_route manualmente desde un componente o acción especial.
    // // Útil si quieres forzar la ruta (ej: después de un proceso, botón especial, etc).
    // // En navegación normal, no es necesario llamarla (el efecto automático lo hace).
    // const setLastRoute = useCallback(
    //     (route) => {
    //         if (user && user.id) {
    //             localStorage.setItem('last_route', route);
    //             if (localStorage.getItem('token')) {
    //                 updateLastRoute({ userId: user.id, last_route: route, token: localStorage.getItem('token') });
    //             }
    //         }
    //     },
    //     [user]
    // );

    // // Permite redirigir manualmente a la última ruta válida guardada.
    // // Útil después de login, registro, o eventos especiales.
    // // En navegación normal, no es necesario llamarla (el usuario navega normalmente).
    // const redirectToLastRoute = useCallback(() => {
    //     let last_route = localStorage.getItem('last_route') || '/dashboard';
    //     if (!last_route.startsWith('/')) last_route = '/' + last_route;
    //     if (!last_route.startsWith('/dashboard')) last_route = '/dashboard';
    //     navigate(last_route, { replace: true });
    // }, [navigate]);

    // return {
    //     setLastRoute,
    //     redirectToLastRoute,
    //     last_route: localStorage.getItem('last_route') || '/dashboard',
    // };
};

export default useLastRouteManager;
