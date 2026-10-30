import React from 'react'
import { useSelector } from 'react-redux';

export const usePrinterStatus = (impresora, printersStatus = null, printerName) => {
    const { printersGStatus } = useSelector((state) => state.util.util);
    const { nombre, lastPrint, lastSeen } = impresora
    const on = !!printersStatus && !!printersStatus[impresora.nombre]
    const color = on ? "green" : "red"
    const state = on ? "operacional" : "Sin conexión"
    let payload = { on, color, state, lastSeen }
    // if (!!printerGStatus && !!printerGStatus[nombre].loaded) {
    payload.loaded = printersStatus?.loaded
    // }
    if (on) {
        const printerStatus = printersStatus[nombre]
        const estado = printerStatus?.connection?.current?.state
        const flags = printerStatus?.printerState?.state?.flags
        const text = printerStatus?.printerState?.state?.text
        const printing = !!flags && estado === "Printing"
        const paused = !!flags && flags?.paused
        const pausing = !!flags && flags?.pausing
        const ready = !!flags && flags?.ready
        const finishing = !!flags && flags?.finishing
        const tempOn = !!printerStatus?.printerState?.temperature?.bed?.actual
        const completionNumber = printerStatus?.printProgress?.progress?.completion
        const timeLeft = secondsToMHMS(printerStatus?.printProgress?.progress?.printTimeLeft)
        const elapse = printerStatus?.elapse
            ? secondsToMHMS((printerStatus?.elapse) / 1000)
            : lastSeen
                ? secondsToMHMS((Date.now() - lastSeen) / 1000)
                : "-"
        const inAction =
            estado === "Printing" ||
            estado === "Pausing" ||
            estado === "Paused"
        const completion = printerStatus?.printProgress?.progress?.completion
            ? ` (${printerStatus?.printProgress?.progress?.completion.toFixed(0)} %)`
            : " -%"
        if (!!tempOn) {
            let { actual, target } = printerStatus?.printerState?.temperature?.bed
            let inRange = target === 0 || actual > target - 1 && actual < target + 1
            payload.bedTemp = { actual: Number(actual.toFixed()), target: Number(target.toFixed()), inRange }
            {
                let { actual, target } = printerStatus?.printerState?.temperature?.tool0
                let inRange = target === 0 || actual > target - 1 && actual < target + 1
                payload.nozzleTemp = { actual: Number(actual.toFixed()), target: Number(target.toFixed()), inRange }
            }
        }
        // const printTime = impresora.octo?.printTime < 60
        //     ? ">1m"
        //     : secondsToMHMS(_octoprint_API?.printProgress?.progress?.printTime),
        return {
            ...payload,
            printing,
            paused,
            pausing,
            completion,
            elapse,
            inAction,
            tempOn,
            ready,
            finishing,
            completionNumber,
            timeLeft,
            text,
            // printTime,
            state
        }
    } else {
        return payload
    }
}

// const color = {
//     text: on ? "text-success" : "text-danger",
//     bg: on ? "bg-success" : "bg-danger",
//     border: on ? "border-success" : "border-danger",
// }