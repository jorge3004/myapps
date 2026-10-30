import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { printersGStatusLoadingFc } from "../components/dashboard/printers/printersGStatusHelperLoading"
import { setPrintersGStatus } from "../store/slices/utilSlice"
import { printersGStatusFc } from "./printersGStatusHelper"
import { editarImpresora } from "../store/thunks/thunksImpresoras"

export const useFirstLoadingPrinter = () => {
    let timeoutId = useRef(5000)
    let init = useRef(true)
    let firstLoading = useRef(true)
    const { user } = useSelector((state) => state.user);
    const { impresoras } = useSelector((state) => state.impresoras.impresoras);
    const { printersStatus, printersGStatus } = useSelector((state) => state.util.util);
    const dispatch = useDispatch()

    useEffect(() => {
        let timeoutI;
        let to
        if (!!impresoras && init.current) {
            if (!!printersGStatus) {
                firstLoading.current = false
            } else {
                const payload = printersGStatusLoadingFc(impresoras, printersGStatus)
                dispatch(setPrintersGStatus(payload))
            }
            init.current = false
        }
        if (!init.current) {
            let payload
            timeoutI = setTimeout(() => {
                payload = printersGStatusFc(impresoras, printersStatus, !firstLoading.current && printersGStatus, user.lan)
                if (payload.msg) {
                    // if (payload.msg && !!payload[payload.nombre]) {
                    const { lastAction, iid, id, nombre } = payload.msg
                    if (lastAction === "nivelar_standby") {
                        to = setTimeout(() => {
                            dispatch(editarImpresora({ lastAction: `${lastAction}_${id}` }, iid))
                        }, 1500);
                    } else {
                        dispatch(editarImpresora({ lastAction }, iid))
                        payload[nombre].loading = false
                        delete payload.msg
                        dispatch(setPrintersGStatus(payload))
                    }
                } else {
                    dispatch(setPrintersGStatus(payload))
                }
                firstLoading.current = false
            }, timeoutId.current);
            timeoutId.current = null
        }
        // console.log("entró")
        return () => {
            // console.log("salió")
            clearTimeout(timeoutI)
            if (to) {
                clearTimeout(to)
            }
        }
    }, [impresoras, printersStatus])
    return

}