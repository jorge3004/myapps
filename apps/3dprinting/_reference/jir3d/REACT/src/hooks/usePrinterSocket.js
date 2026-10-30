import React, { useState, useEffect } from 'react';
import { socketJir3d } from '../helpers/socketJir3d';
import { useDispatch, useSelector } from 'react-redux';
import { deletePrinterStatus, setPrintersStatus } from '../store/slices/utilSlice';
import { editarImpresora } from '../store/thunks/thunksImpresoras';
import { jir3dRoles } from '../helpers/jir3dRoles';

export const usePrinterSocket = () => {

    const { printersStatus } = useSelector(state => state.util.util)
    const { impresoras } = useSelector(state => state.impresoras.impresoras)
    const { user } = useSelector(state => state.user)
    const { adminFetch } = jir3dRoles(user)
    const dispatch = useDispatch()

    const myFc = () => {
        impresoras.forEach(impresora => {
            const { nombre, iid } = impresora
            // console.log(printersStatus)
            if (!!printersStatus) {
                if (printersStatus[nombre]) {
                    const elapse = Date.now() - printersStatus[nombre].lastSeen
                    console.log(elapse, nombre);
                    if (elapse > 15000) {
                        const lastSeen = Date.now()
                        dispatch(editarImpresora({ lastSeen }, iid))
                        dispatch(deletePrinterStatus(nombre))
                    }
                }
                // if (printersStatus[nombre])
                // else if (lastSeen) {
                //     const elapse = Date.now() - lastSeen
                //     let newPayload = { [nombre]: { elapse, iid, nombre, lastSeen: Date.now() } }
                //     dispatch(setPrintersStatus(newPayload))
                // }
            }
        });
    }

    useEffect(() => {
        let interval = null
        if ((adminFetch || user.iid) && !!impresoras) {
            interval = setInterval(() => {
                myFc()
            }, 1500)
        }
        return () => {
            if (interval) {
                console.log('clear usePrinterSocket Interval', interval)
                clearInterval(interval)
            }
        }
    }, [printersStatus, impresoras])

    return
}