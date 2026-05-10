// Hook: usePasswordResetStatus.js
import { useState, useEffect } from 'react';
import { getPasswordResetStatus } from '../../../api/passwordResetApi';

export default function usePasswordResetStatus(user_id) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user_id) return;
        setLoading(true);
        getPasswordResetStatus(user_id)
            .then(res => setStatus(res.status))
            .catch(err => setError(err.response?.data?.message || 'Failed to fetch status'))
            .finally(() => setLoading(false));
    }, [user_id]);

    return { status, loading, error };
}
