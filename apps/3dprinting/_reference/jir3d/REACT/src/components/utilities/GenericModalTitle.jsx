import React from 'react'
import { useGenericModalLabels } from '../../hooks/useGenericModalLabels'
import {
    CloseButton,
} from "reactstrap";

export const GenericModalTitle = ({
    action,
    tmp,
    closeModal
}) => {

    const { title } = useGenericModalLabels(action)
    return (
        action === 'modalImg' ?
            <div className="d-flex align-self-center">
                <h6 className="m-auto">{tmp?.title}</h6>
                <CloseButton className="align-self-center ms-3" onClick={closeModal} />
            </div>
            :
            <div className="d-flex">
                <h5 className="my-auto">{title} </h5>
                {
                    tmp &&
                    <h5 className="ms-2 fw-bolder my-auto">{tmp.usuario || tmp.nombre}</h5>
                }
            </div>
    )
}
