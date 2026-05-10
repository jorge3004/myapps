// Hook: useRejectPasswordReset.js
import { useState } from 'react';
import { rejectPasswordResetRequest } from '../../../api/passwordResetApi';

export default function useRejectPasswordReset() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const rejectRequest = async (id) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await rejectPasswordResetRequest(id);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Reject failed');
        } finally {
            setLoading(false);
        }
    };

    return { rejectRequest, loading, error, success };
}
