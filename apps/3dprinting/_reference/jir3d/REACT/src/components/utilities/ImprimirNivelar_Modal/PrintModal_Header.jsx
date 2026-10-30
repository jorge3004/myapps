import React from 'react'
import { ModalHeader, CloseButton } from "reactstrap";
import { useCloseModal } from '../../../hooks/modal/useCloseModal';
import { closeModalButton } from '../../dashboard/modals/helper/Modal_helpers';

export const PrintModal_Header = () => {
    const closeModal = useCloseModal()
    const externalCloseBtn = closeModalButton(closeModal)
    return (
        <ModalHeader
            close={externalCloseBtn}
            className="justify-content-center">
            <div className="fw-bolder ">
                Impresión
            </div>
        </ModalHeader>
    )
}
