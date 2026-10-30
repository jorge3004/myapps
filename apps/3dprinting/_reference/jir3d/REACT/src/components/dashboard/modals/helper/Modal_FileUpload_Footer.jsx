import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ModalFooter, Button } from "reactstrap";
import { deleteFromRepository, getFileFromRepository, uploadFile } from '../../../../store/thunks/thunksRepositorio';

export const Modal_FileUpload_Footer = ({ inputValues, setError, modalMode }) => {
    const dispatch = useDispatch();
    const { modal } = useSelector((state) => state.util.util);
    const { loading, dropdownSelected } = modal
    const subir = () => {
        let body = {}
        body.desc = inputValues.text
        const { uid, tid, cid, tlink, tsrc, ttitle } = modal.item
        body = { ...body, uid, tid, cid, tlink, tsrc, ttitle }
        if (inputValues.file) {
            body.fileJir3d = inputValues.file
            const nameArray = inputValues.file.name.split(".")
            const extension = nameArray[nameArray.length - 1]
            if (extension !== "gcode")
                return setError("Archivo debe ser extension gcode")
        }
        if (modalMode === "delete") {
            if (!dropdownSelected)
                return setError("Seleccione versión a actualizar")
            return dispatch(deleteFromRepository())
        }
        if (modalMode === "get") {
            if (!modal.dropdownSelected)
                return setError("Seleccione versión a actualizar")
            return dispatch(getFileFromRepository())
        }
        if (!inputValues.text.trim())
            return setError("Ingresa una descripción no en blanco")
        if (modalMode === "update") {
            if (!modal.dropdownSelected)
                return setError("Seleccione versión a actualizar")
            if (modal.dropdownSelected?.desc == inputValues.text && !inputValues.file) {
                return setError("Ingresa descripción diferente o/y selecciona archivo")
            }
            return dispatch(uploadFile(body))
        }

        if (!inputValues.file)
            return setError("Selecciona un archivo")
        dispatch(uploadFile(body))
    }
    return (
        <ModalFooter className="justify-content-center">
            {(!loading) &&
                <Button className={`btn ${modalMode !== "delete" ? "btn-success" : "btn-danger"}  `} onClick={subir}>
                    {
                        modalMode === "delete" ? "Eliminar" :
                            modalMode === "update" ? "Actualizar" :
                                modalMode === "add" ? "Añadir" :
                                    modalMode === "get" ? "ver" :
                                        "Subir"
                    }
                </Button>}
        </ModalFooter>)
}
