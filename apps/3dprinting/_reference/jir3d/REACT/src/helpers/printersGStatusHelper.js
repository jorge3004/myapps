
import { cToF } from "./cToF";
import { secondsToMHMS } from "./secondsToMHMS";
export const printersGStatusFc = (impresoras, printersStatus = null, printersGStatus = null, lan = "MX") => {
    const output = {}
    impresoras.forEach(impresora => {
        const { nombre, lastAction, lastSeen } = impresora
        const on = !!printersStatus && !!printersStatus[nombre]
        const color = {
            text: on ? "text-success" : "text-danger",
            bg: on ? "bg-success" : "bg-danger",
            border: on ? "border-success" : "border-danger",
        }
        const state = on ? "operacional" : "Sin conexión"
        let payload = { on, color, state, lastSeen }

        if (!!printersGStatus) {
            if (lastAction === "iniciar" && printersGStatus[nombre].inAction) {
                output.msg = { lastAction: "iniciado", iid: impresora.iid, nombre }
            }
            if (lastAction === "reiniciar" && printersGStatus[nombre].printing) {
                output.msg = { lastAction: "reiniciado", iid: impresora.iid, nombre }
            }
            else if (lastAction === "parar" && !printersGStatus[nombre].inAction) {
                output.msg = { lastAction: "parado", iid: impresora.iid, nombre }
            }
            else if (lastAction === "pausar" && printersGStatus[nombre].paused) {
                output.msg = { lastAction: "pausado", iid: impresora.iid, nombre }
            }
            else if (lastAction === "continuar") {
                output.msg = { lastAction: "continuado", iid: impresora.iid, nombre }
            }
            else if (lastAction.indexOf("continuar_nivelar_") >= 0) {
                const id = Number(lastAction.charAt(lastAction.length - 1));
                output.msg = { lastAction: "nivelar_standby", id, iid: impresora.iid, nombre }
            }
            else if (lastAction.indexOf("nivelar_standby") >= 0 && printersGStatus[nombre].paused) {
                const id = Number(lastAction[lastAction.length - 1]);
                output.msg = { lastAction: `continuar_nivelar_${id}`, iid: impresora.iid, nombre }
            }
            else
                payload.loading = !!printersGStatus[nombre]?.loading && printersGStatus[nombre].loading
        } else
            payload.loading = false

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
            const printTime = printerStatus.printProgress.progress.printTime < 60
                ? ">1m"
                : secondsToMHMS(printerStatus.printProgress.progress.printTime)
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
                if (lan === "MX")
                    payload.bedTemp = { actual: Number(actual.toFixed()), target: Number(target.toFixed()), inRange }
                else
                    payload.bedTemp = { actual: cToF(Number(actual.toFixed())), target: cToF(Number(target.toFixed())), inRange }
                {
                    let { actual, target } = printerStatus?.printerState?.temperature?.tool0
                    let inRange = target === 0 || actual > target - 1 && actual < target + 1
                    if (lan === "MX")
                        payload.nozzleTemp = { actual: Number(actual.toFixed()), target: Number(target.toFixed()), inRange }
                    else
                        payload.nozzleTemp = { actual: cToF(Number(actual.toFixed())), target: cToF(Number(target.toFixed())), inRange }
                }
            }
            output[nombre] = {
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
                state,
                printTime,
            }
        } else
            output[nombre] = payload
    })
    return output
}