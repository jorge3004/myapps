import React, { useState } from 'react'
import { Button } from "reactstrap"
import * as AiIcons from "react-icons/ai";
import * as HiIcons from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../../store/slices/utilSlice';
import { Loading } from '../Loading';
import { defaults } from '../../../data/initializations';
import axios from "axios";
import { cToF } from '../../../helpers/cToF';

const impresorasEndPoint = `${defaults.jir3dAPIs.default}/impresoras`;

export const PrintModal_Conf_Module = ({ title, mode }) => {
    const { modal } = useSelector((state) => state.util.util);
    const { lan } = useSelector((state) => state.user.user);
    const { loading } = modal
    // const { bedTemp, bedParam, iid } = modal.impresora
    const { nozzleTemp, bedTemp, bedParam, iid } = modal.impresora
    const dispatch = useDispatch()
    const [error, setError] = useState({ nozzleTemp: "", bedTemp: "", bedParam: "" })
    let myObj = {
        nozzleTemp,
        bedTemp,
        bedParam
    }
    const fc = async (mode, op) => {
        const value = mode === "bedParam" ? 0.025 : 5
        const max = mode === "bedTemp" ? 70 :
            mode === "nozzleTemp" ? 215 : .25
        const min = mode === "bedTemp" ? 0 :
            mode === "nozzleTemp" ? 175 : 0
        if (myObj[mode] === max && op === "+")
            return setError({ ...error, [mode]: lan === "MX" ? `Ha alcanzando el máximo` : "Has reached maximum" })
        if (myObj[mode] === min && op === "-")
            return setError({ ...error, [mode]: lan === "MX" ? `Ha alcanzado el mínimo` : "Has reached minimum" })
        eval(`myObj[mode] ${op}= ${value}`)
        if (mode === "bedParam")
            myObj[mode] = Number(myObj[mode].toFixed(3))
        await dispatch(setModal({ ...modal, loading: { [mode]: true } }))
        const { data } = await axios.put(`${impresorasEndPoint}/${iid}`, myObj)
        await dispatch(setModal({ ...modal, impresora: data, loading: { [mode]: false } }))
        setError({ ...error, [mode]: "" })
    }
    return (
        <div >
            <div className='text-center mb-1'>
                {title}
            </div>
            <div className="d-flex justify-content-center w-50 rounded-3 m-auto border">
                {
                    !!loading && loading[mode] ?
                        <Loading msg={""} /> : <>
                            <div className="text-muted m-auto" onClick={() => fc(mode, "-")}>
                                {mode === "bedParam" ? <HiIcons.HiUpload size="15" /> : <AiIcons.AiOutlineMinus size="15" />}
                            </div>
                            <div className="wm-25 text-center temp">{lan === "MX" || mode === "bedParam" ? myObj[mode] : cToF(Number(myObj[mode]))}</div>
                            <Button className="text-muted m-auto bg-transparent m-0 p-0 border-white" onClick={() => fc(mode, "+")}>
                                {mode === "bedParam" ? <HiIcons.HiDownload size="15" /> : <AiIcons.AiOutlinePlus size="15" />}
                            </Button>
                        </>
                }
            </div>
            <div className='text-danger d-flex justify-content-center'>{error[mode]}</div>
        </div>
    )
}