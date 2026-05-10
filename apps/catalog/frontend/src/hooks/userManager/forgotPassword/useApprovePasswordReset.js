// Hook: useApprovePasswordReset.js
import { useState } from 'react';
import { approvePasswordResetRequest } from '../../../api/passwordResetApi';

export default function useApprovePasswordReset() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const approveRequest = async (id) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await approvePasswordResetRequest(id);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Approve failed');
        } finally {
            setLoading(false);
        }
    };

    return { approveRequest, loading, error, success };
}
