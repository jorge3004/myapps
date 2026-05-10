const API_URL = process.env.REACT_APP_API_URL || '/api';

export async function updateLastRoute({ userId, last_route, token }) {
    const res = await fetch(`${API_URL}/users/${userId}/last-route`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ last_route }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al actualizar last_route');
    }
    return data;
}
