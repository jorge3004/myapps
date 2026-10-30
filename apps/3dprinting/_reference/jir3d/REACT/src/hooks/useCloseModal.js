import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

export const useCloseModal = (setModal) => {
    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                setModal('');
            }
        };
        window.addEventListener("keydown", close);
        return () => {
            window.removeEventListener("keydown", close);
        };
    }, []);

    const closeModal = () => {
        setModal('');
    };
    return (closeModal)
}
