import React, { createContext, useContext } from 'react';
import useCatalogs from '../hooks/catalog/useCatalogs';

export const CatalogsContext = createContext(null);

export function CatalogsProvider({ children }) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const catalogsState = useCatalogs(token);
    return (
        <CatalogsContext.Provider value={catalogsState}>
            {children}
        </CatalogsContext.Provider>
    );
}

export function useCatalogsContext() {
    return useContext(CatalogsContext);
}