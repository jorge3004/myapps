import { useState } from 'react';
import { deactivateUser } from '../../api/userApi';

export default function useDeactivateUser(token, setUsers, setError, inactiveUsers, setInactiveUsers) {
    const [deactivating, setDeactivating] = useState({});

    const handleDeactivate = async (userId) => {
        setDeactivating((prev) => ({ ...prev, [userId]: true }));
        setError && setError('');
        try {
            await deactivateUser({ userId, token });
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            // Agregar a inactivos en orden por id ascendente
            setInactiveUsers && setInactiveUsers((prev) => {
                const deactivated = prev.find(u => u.id === userId) || (typeof users !== 'undefined' ? users.find(u => u.id === userId) : undefined);
                if (!deactivated && typeof users !== 'undefined') {
                    const userFromUsers = users.find(u => u.id === userId);
                    if (!userFromUsers) return prev;
                    return [...prev, { ...userFromUsers, status: 'inactive' }].sort((a, b) => a.id - b.id);
                }
                if (deactivated) {
                    return prev.map(u => u.id === userId ? { ...u, status: 'inactive' } : u).sort((a, b) => a.id - b.id);
                }
                return prev;
            });
        } catch (err) {
            setError && setError(err.message);
        }
        setDeactivating((prev) => ({ ...prev, [userId]: false }));
    };

    return { deactivating, handleDeactivate };
}
