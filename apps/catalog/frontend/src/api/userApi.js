// Crear usuario por admin (con flag y rol)
export async function createUserByAdmin({ preferred_name, last_name, role, token, username }) {
    const API_URL = process.env.REACT_APP_API_URL || '/api';
    const body = { preferred_name, last_name, role, created_by_admin: true };
    if (username) body.username = username;
    const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        if (data.suggested_username) {
            throw { message: data.message, suggested_username: data.suggested_username };
        }
        throw new Error(data.message || 'Error al crear usuario');
    }
    return data;
}
// Login de usuario
export async function loginUser({ username, password, last_route }) {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, last_route }),
        });
        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, data };
    } catch (err) {
        return { ok: false, status: 0, data: { message: 'Network error' } };
    }
}
// Cambiar rol de usuario (requiere token y ser admin)
export async function updateUserRole({ userId, role, token }) {
    const res = await fetch(`${API_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al actualizar rol');
    }
    return data;
}

// Eliminar usuario (requiere token y ser admin)
export async function deleteUser({ userId, token }) {
    const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al eliminar usuario');
    }
    return data;
}

// Inactivar usuario (soft delete)
export async function deactivateUser({ userId, token }) {
    const res = await fetch(`${API_URL}/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'inactive' }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al inactivar usuario');
    }
    return data;
}

// Actualizar last_route del usuario autenticado
export async function updateLastRoute({ userId, last_route, token }) {
    const API_URL = process.env.REACT_APP_API_URL || '/api';
    const res = await fetch(`${API_URL}/users/${userId}/last-route`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ last_route }),
    });
    if (!res.ok) {
        // No lanzar error, solo loguear
        console.warn('No se pudo actualizar last_route en backend');
    }
}

const API_URL = process.env.REACT_APP_API_URL || '/api';

export async function registerUser({ preferred_name, last_name, password }) {
    const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferred_name, last_name, password }),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Error al registrar usuario');
    }
    return res.json();
}

// Obtener todos los usuarios (requiere token)
export async function getUsers(token) {
    const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al obtener usuarios');
    }
    return data.users;
}

// Aprobar usuario (requiere token y ser admin)
export async function approveUser({ userId, token }) {
    const res = await fetch(`${API_URL}/users/${userId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al aprobar usuario');
    }
    return data;
}
