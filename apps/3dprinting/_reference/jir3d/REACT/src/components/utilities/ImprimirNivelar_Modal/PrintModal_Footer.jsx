import React from 'react'
import axios from 'axios'
import { ModalFooter, Button } from "reactstrap";
import { defaults } from '../../../data/initializations';
import { useDispatch, useSelector } from 'react-redux';
import { clearImpresion, clearModal, setPrintersGStatus } from '../../../store/slices/utilSlice';
import { useLocation, useNavigate } from "react-router-dom";
import { editarImpresora } from '../../../store/thunks/thunksImpresoras';
import { printersGStatusLoadingFc } from '../../../helpers/printersGStatusHelperLoading';

// const impresorasEndPoint = `${defaults.jir3dAPIs.default}/impresoras`;

export const PrintModal_Footer = ({ setError }) => {
    const { action, impresora, dropdownSelected, loading: loadingDropdown, dropdownLoaded } = useSelector(state => state.util.util.modal)
    const { printersGStatus } = useSelector(state => state.util.util)
    const { impresoras } = useSelector(state => state.impresoras.impresoras)
    const cond = loadingDropdown?.bedParam || loadingDropdown?.nozzleTemp || loadingDropdown?.bedTemp
    const loading = action === "imprimir" ? cond || !dropdownLoaded : cond
    const { iid, nombre } = impresora
    const dispatch = useDispatch()
    // const { path } = useLocation()
    const { pathname } = useLocation()
    const navigate = useNavigate();
    const actionExec = async () => {
        let payload = { comando: action }
        if (action === "imprimir") {
            if (!dropdownSelected)
                return setError("Seleccione versión a imprimir")
            const fileName1 = dropdownSelected.uploadPath.split("/")
            const fileName = fileName1[fileName1.length - 1].split(".")[0]
            payload.lastPrint = fileName
        } else
            payload.lastPrint = action

        payload.lastAction = "iniciar"
        dispatch(editarImpresora(payload, iid));
        // if (!!printersGStatus) {
        //     const params = { ...printersGStatus, [nombre]: { ...printersGStatus[nombre], loading: true } }
        //     dispatch(setPrintersGStatus(params));
        // } else {
        const payload2 = printersGStatusLoadingFc(impresoras, printersGStatus, nombre)
        dispatch(setPrintersGStatus(payload2));
        // }
        dispatch(clearImpresion())
        if (pathname !== "/dashboard/impresoras")
            navigate("/dashboard/impresoras");
        dispatch(clearModal());

    };
    return (
        <ModalFooter className={"d-flex justify-content-center"}>
            <Button
                color={"success"}
                onClick={actionExec}
                disabled={loading}
            >
                {action}
            </Button>
        </ModalFooter>
    )
}
