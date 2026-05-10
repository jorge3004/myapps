import { useState, useEffect } from 'react';
import { getUsers } from '../../api/userApi';

export default function useUsers(token) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            setError('');
            try {
                const data = await getUsers(token);
                // Filtrar solo usuarios activos
                setUsers(Array.isArray(data) ? data.filter(u => u.status === 'active' || u.status === 'pending') : []);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        }
        if (token) fetchUsers();
    }, [token]);

    return { users, setUsers, loading, error, setError };
}
