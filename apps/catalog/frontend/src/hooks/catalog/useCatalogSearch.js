import { useState, useMemo } from 'react';

export default function useCatalogSearch(catalogs) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCatalogs = useMemo(() => {
        if (!searchTerm) return catalogs;
        return catalogs.filter(cat =>
            cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [catalogs, searchTerm]);

    return { searchTerm, setSearchTerm, filteredCatalogs };
}
