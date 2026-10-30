import React from 'react'
import { ModalHeader, CloseButton } from "reactstrap";
import { useSelector } from 'react-redux';
import { useCloseModal } from '../../../../hooks/useCloseModal';

export const Modal_Header = ({ title = "" }) => {
    const closeModal = useCloseModal()
    const { modal } = useSelector(state => state.util.util)
    const { lan } = useSelector(state => state.user.user)

    const printer = modal.impresora?.nombre
    const newTitle = lan === "MX" && title === "Impresión"
        ? `Impresora: ${printer}`
        : `Printer: ${printer}`

    const externalCloseBtn =
        <CloseButton
            className="btn-light"
            style={{ position: 'absolute', right: '35px' }}
            onClick={closeModal}
        >
        </CloseButton>
    return (
        <ModalHeader
            close={externalCloseBtn}
            className="justify-content-center"
        >
            {
                title === "Impresión"
                    ?
                    <>
                        <label className="">
                            {`${newTitle.split(":")[0]}`}
                        </label>
                        <label className="fw-bolder text-uppercase">
                            {` :${newTitle.split(":")[1]}`}
                        </label>
                    </>
                    :
                    <label className="fw-bolder ">
                        {title}
                    </label>
            }


            <img src={modal.item?.tsrc} width={45} className="rounded mx-2" />

        </ModalHeader>
    )
}
