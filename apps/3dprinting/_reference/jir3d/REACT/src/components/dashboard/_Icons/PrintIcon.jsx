import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import { setModal } from '../../../store/slices/utilSlice';

export const PrintIcon = ({ item, classAtt = "" }) => {
    const dispatch = useDispatch()
    const { printersStatus } = useSelector(state => state.util.util)
    const { impresoras } = useSelector(state => state.impresoras.impresoras)
    const { iid } = useSelector(state => state.user.user)
    const [printer, setPrinter] = useState(false)
    const nombre = !!printer && printer.nombre
    const printerOn = !!nombre && !!printersStatus && !!printersStatus[nombre]
    const connection = printerOn && !!printersStatus[nombre].printerState?.state?.flags
    const ready = connection && printersStatus[nombre].printerState.state?.flags?.ready
    const imprimir = () => {
        const impresora = !!impresoras && impresoras.find(item => item.iid === iid)
        dispatch(setModal({ action: "imprimir", loadingModal: true, item, impresora }))
    };
    useEffect(() => {
        setPrinter(!!impresoras && !!printersStatus && impresoras.find((impresora) => impresora.iid === iid))
    }, [printersStatus])

    return (
        <>
            {
                !!iid && !!printer &&
                <>
                    {
                        !printerOn
                            ?
                            <MdIcons.MdPrintDisabled
                                style={{ cursor: "pointer", color: "red" }}
                                className={classAtt}
                            />
                            :
                            ready
                                ?
                                <FaIcons.FaPrint
                                    style={{ cursor: "pointer", color: "gray" }}
                                    className={classAtt}
                                    onClick={imprimir}
                                />
                                :
                                connection
                                    ?
                                    <FaIcons.FaPrint
                                        style={{ cursor: "pointer", color: "orange" }}
                                        className={`${classAtt} animate__animated animate__flash animate__infinite animate__slower`}
                                    />
                                    :
                                    <FaIcons.FaInfo
                                        style={{ cursor: "pointer", color: "orange" }}
                                        className={`${classAtt} `}
                                    />

                    }
                </>
            }
        </>)
}
