import { useState, useEffect, useCallback } from 'react';
import { getCatalogs, uploadCatalog, deleteCatalog, getOrCreateThumbnail } from '../../api/catalogApi';

export default function useCatalogs(token) {
    const [catalogs, setCatalogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchCatalogs = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getCatalogs(token);
            const catalogsWithThumbs = await Promise.all(
                data.map(async (cat) => {
                    let thumbnailUrl = cat.thumbnail_url || null;
                    if (!thumbnailUrl) {
                        try {
                            thumbnailUrl = await getOrCreateThumbnail(cat.id, token);
                        } catch (e) {
                            thumbnailUrl = null;
                        }
                    }
                    return { ...cat, thumbnail_url: thumbnailUrl };
                })
            );
            setCatalogs(catalogsWithThumbs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchCatalogs();
    }, [token, fetchCatalogs]);

    const handleUpload = async (e, name, file) => {
        e.preventDefault();
        setUploading(true);
        setError('');
        try {
            await uploadCatalog({ name, file, token });
            await fetchCatalogs();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        setError('');
        try {
            await deleteCatalog({ id, token });
            await fetchCatalogs();
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        catalogs,
        loading,
        error,
        uploading,
        fetchCatalogs,
        handleUpload,
        handleDelete,
        setError,
    };
}
