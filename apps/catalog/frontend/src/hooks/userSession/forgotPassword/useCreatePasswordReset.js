// Hook: useCreatePasswordReset.js
import { useState } from 'react';
import { createPasswordResetRequest } from '../../../api/passwordResetApi';

export default function useCreatePasswordReset() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createRequest = async (user_id) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await createPasswordResetRequest(user_id);
            setSuccess(true);
            setLoading(false);
            return { success: true };
        } catch (err) {
            let msg = err.message || 'Request failed';
            if (msg.toLowerCase().includes('not found')) msg = 'User not found';
            if (msg.toLowerCase().includes('invalid user')) msg = 'Invalid user';
            setError(msg);
            setLoading(false);
            return { success: false, error: msg };
        }
    };

    return { createRequest, loading, error, success };
}
