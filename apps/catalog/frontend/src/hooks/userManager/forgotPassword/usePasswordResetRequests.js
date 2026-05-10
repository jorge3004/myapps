// Hook: usePasswordResetRequests.js
import { useState, useEffect } from 'react';
import { getPasswordResetRequests } from '../../../api/passwordResetApi';

export default function usePasswordResetRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getPasswordResetRequests();
            setRequests(res.requests || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return { requests, loading, error, refetch: fetchRequests };
}
