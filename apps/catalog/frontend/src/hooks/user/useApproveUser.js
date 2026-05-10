import { useState } from 'react';
import { approveUser, getUsers } from '../../api/userApi';

export default function useApproveUser(token, setUsers, setError) {
    const [approving, setApproving] = useState({});

    const handleApprove = async (userId) => {
        setApproving((prev) => ({ ...prev, [userId]: true }));
        setError && setError('');
        try {
            await approveUser({ userId, token });
            const data = await getUsers(token);
            setUsers(data);
        } catch (err) {
            setError && setError(err.message || 'Error al aprobar usuario');
        }
        setApproving((prev) => ({ ...prev, [userId]: false }));
    };

    return { approving, handleApprove };
}
