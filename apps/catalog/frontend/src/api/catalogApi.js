// frontend/src/api/catalogApi.js
const API_URL = process.env.REACT_APP_API_URL || '/api';

export async function uploadCatalog({ file, name, token }) {
    const formData = new FormData();
    formData.append('file', file);
    if (name) formData.append('name', name);
    const res = await fetch(`${API_URL}/catalogs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al subir catálogo');
    }
    return data;
}

export async function getCatalogs(token) {
    const res = await fetch(`${API_URL}/catalogs`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al obtener catálogos');
    }
    return data.catalogs;
}

export async function deleteCatalog({ id, token }) {
    const res = await fetch(`${API_URL}/catalogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al eliminar catálogo');
    }
    return data;
}

// Nueva función para obtener o crear el thumbnail de un catálogo
export async function getOrCreateThumbnail(catalogId, token) {
    const res = await fetch(`${API_URL}/catalogs/${catalogId}/thumbnail`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al obtener/crear thumbnail');
    }
    return data.thumbnailUrl;
}
