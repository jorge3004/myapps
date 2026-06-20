// Lógica modularizada de autenticación
import { useState, useEffect } from 'react';
import useSessionManager from './useSessionManager';
import useApplyUserSession from './useApplyUserSession';
// Auxiliar: cargar usuario desde localStorage
function getUserFromLocalStorage() {
    const stored = localStorage.getItem('user');
    if (stored) {
        try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
}

// Auxiliar: obtener usuario desde API
async function fetchUserFromApi(apiUrl, token) {
    const runtimeEnv = (localStorage.getItem('runtime:selectedEnvironment') || 'dev').toLowerCase();
    const dataSource = (localStorage.getItem('runtime:selectedDataSource') || 'mysql').toLowerCase();
    const res = await fetch(apiUrl + '/users/me', {
        headers: {
            Authorization: `Bearer ${token}`,
            'x-runtime-env': runtimeEnv,
            'x-data-source': dataSource
        },
    });
    if (!res.ok) throw new Error('invalid-token');
    const data = await res.json();
    return data.user;
}



export function useAuthLogic() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);
    const [apiErrorMsg, setApiErrorMsg] = useState('');
    const [hasSession, setHasSession] = useState(false);
    const [authErrorReason, setAuthErrorReason] = useState(null); // 'no-token', 'invalid-token', 'expired-token', null
    const [authOrigin, setAuthOrigin] = useState(null); // 'login' | 'localStorage' | null

    // Pasar setters explícitos para evitar ciclo de contexto
    // const { applyUserSession, clearUserSession } = useApplyUserSession({
    //     setUser,
    //     setHasSession,
    //     setAuthErrorReason,
    //     setAuthOrigin,
    // });
    const { applyUserSession, clearUserSession } = useSessionManager({
        setUser,
        setHasSession,
        setAuthErrorReason,
        setAuthOrigin,
    });
    useEffect(() => {
        // Si la sesión fue iniciada por login o ya hay sesión, no validar con la API
        if (authOrigin === 'login' || hasSession) {
            setLoading(false);
            return;
        }
        // Si estamos en /login y no hay token, no validar con la API
        const pathname = window.location.pathname;
        const token = localStorage.getItem('token');
        if (pathname === '/login' && !token) {
            clearUserSession();
            setAuthErrorReason('no-token');
            setLoading(false);
            return;
        }
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
            setApiError(true);
            setApiErrorMsg('No server URL configured. Please contact the administrator.');
            setLoading(false);
            return;
        }
        const runtimeEnv = (localStorage.getItem('runtime:selectedEnvironment') || 'dev').toLowerCase();
        const dataSource = (localStorage.getItem('runtime:selectedDataSource') || 'mysql').toLowerCase();
        fetch(apiUrl + '/health', {
            headers: {
                'x-runtime-env': runtimeEnv,
                'x-data-source': dataSource
            }
        })
            .then(async (res) => {
                if (!res.ok) {
                    setApiError(true);
                    setApiErrorMsg('Server is not responding correctly. Please contact the administrator.');
                    setLoading(false);
                    return;
                }
                if (token) {
                    try {
                        const user = await fetchUserFromApi(apiUrl, token);
                        applyUserSession(user, { setLastRoute: true, authOrigin: 'token' });
                    } catch (err) {
                        clearUserSession();
                        setAuthErrorReason('invalid-token');
                    }
                } else {
                    clearUserSession();
                    setAuthErrorReason('no-token');
                }
                setLoading(false);
            })
            .catch(() => {
                setApiError(true);
                setApiErrorMsg('Could not connect to the server. Please check your connection or contact the administrator.');
                setLoading(false);
            });
    }, [authOrigin, hasSession]);

    return {
        user,
        setUser,
        setHasSession,
        loading,
        apiError,
        apiErrorMsg,
        hasSession,
        authErrorReason,
        authOrigin,
        setAuthOrigin,
    };
}