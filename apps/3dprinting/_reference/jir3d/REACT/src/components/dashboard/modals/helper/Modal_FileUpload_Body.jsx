import React from 'react'
import { ProgressBar } from './ProgressBar'
import { Loading } from '../../../utilities/Loading'
import { Modal_FileUpload_InputForm } from './Modal_FileUpload_InputForm'
import { Modal_FileUpload_Dropdown } from './Modal_FileUpload_Dropdown'
import { ModalBody, Card, CardBody, Button } from "reactstrap";
import { useDispatch, useSelector } from 'react-redux'
import { getFileFromRepository } from '../../../../store/thunks/thunksRepositorio'

export const Modal_FileUpload_Body = ({ modalMode, error, handleInputChange, inputValues, setError }) => {
    const { percent, msg, loading, data } = useSelector((state) => state.util.util.modal);
    const { modal } = useSelector((state) => state.util.util);
    const dispatch = useDispatch()
    const submit = () => {
        if (modalMode === "get") {
            if (!modal.dropdownSelected)
                return setError("Seleccione versión a actualizar")
            return dispatch(getFileFromRepository())
        }
    }
    return (
        <ModalBody >
            {
                loading ?
                    <Loading /> :
                    (percent < 100 || percent) ?
                        <ProgressBar percent={percent} /> :
                        <>
                            {
                                (modalMode === "update" || modalMode === "delete" || modalMode === "get") &&
                                <Modal_FileUpload_Dropdown />
                            }

                            {
                                modalMode !== "delete" && modalMode !== "get" &&
                                <Modal_FileUpload_InputForm
                                    inputValues={inputValues}
                                    handleInputChange={handleInputChange}
                                />
                            }
                            <label className="d-flex align-items-center justify-content-center text-danger text-uppercase mt-3">
                                {msg ? msg : error}
                            </label>
                        </>
            }
        </ModalBody>
    )
}
