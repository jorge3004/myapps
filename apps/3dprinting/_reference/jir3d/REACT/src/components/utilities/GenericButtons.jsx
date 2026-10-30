import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Button,
} from "reactstrap";
import { GenericIcons } from './GenericIcons';
import { GenericModal } from './GenericModal';
import { useGenericModalSubmit } from '../../hooks/useGenericModalSubmit';

export const GenericButtons = (props) => {
    const submitForm = useGenericModalSubmit()
    const {
        action,
        tmp,
        label,
        closeModal,
        type,
        submitValues,
        setError,
        submitError,
        setLoading
    } = props
    const [modal, setModal] = useState('')
    const iconProps = {
        action,
        element: 'button',
    }
    const modalProps = {
        action,
        setModal,
        tmp,
    }
    const buttonProps = {
        color:
            type === 'cancel' ? 'danger' :
                'success',
        onClick: (e) => {
            e.preventDefault();
            if (type === 'submit') {
                return submitForm(action, tmp, submitValues, setLoading, setError, closeModal)
            }
            if (type === 'cancel') return closeModal()
            setModal(action)
        },
        size:
            type === 'cancel' || type === 'submit' ? '' :
                'sm',
        type,
        form: type === 'submit' ? "form1" : "",
    }
    return (
        <>
            <Button {...buttonProps}>
                {
                    label || <GenericIcons {...iconProps} />
                }
            </Button>
            {
                modal &&
                <GenericModal {...modalProps} />
            }
        </>
    )
}