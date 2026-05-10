import { useState } from 'react';
import { updateUserRole, getUsers } from '../../api/userApi';

export default function useEditRole(token, setUsers, setError) {
    const [roleEdits, setRoleEdits] = useState({});
    const [savingRole, setSavingRole] = useState({});

    const handleRoleChange = (userId, value) => {
        setRoleEdits((prev) => ({ ...prev, [userId]: value }));
    };

    const handleSaveRole = async (userId) => {
        setSavingRole((prev) => ({ ...prev, [userId]: true }));
        setError && setError('');
        try {
            await updateUserRole({ userId, role: roleEdits[userId], token });
            const data = await getUsers(token);
            setUsers(data);
            setRoleEdits((prev) => ({ ...prev, [userId]: undefined }));
        } catch (err) {
            setError && setError(err.message || 'Error al guardar rol');
        }
        setSavingRole((prev) => ({ ...prev, [userId]: false }));
    };

    return { roleEdits, setRoleEdits, savingRole, handleRoleChange, handleSaveRole };
}
