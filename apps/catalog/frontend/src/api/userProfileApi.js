const API_URL = process.env.REACT_APP_API_URL || '/api';

export async function changePassword({ userId, current, next, token }) {
    const res = await fetch(`${API_URL}/users/${userId}/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current, next }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al cambiar la contraseña.');
    }
    return data;
}
