import React, { createContext, useContext, useEffect, useMemo } from 'react';

import { useAuthLogic } from '../hooks/auth/useAuthLogic';
import { AUTH_ERROR_REASONS } from '../constants/auth/types';


export const AuthContext = createContext();

export function AuthProvider({ children, ...rest }) {
    const auth = useAuthLogic();
    const value = useMemo(() => ({ ...auth, AUTH_ERROR_REASONS, ...rest }), [auth, rest]);
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
