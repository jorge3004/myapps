
export const printersGStatusLoadingFc = (impresoras, printersGStatus, nombre) => {
    const output = {}
    const color = {
        text: "text-dark",
        bg: "bg-dark",
        border: "border-dark",
    }
    impresoras.forEach(impresora => {
        if (!!printersGStatus) {
            let loading = false
            if (nombre === impresora.nombre)
                loading = true
            output[impresora.nombre] = { ...printersGStatus[impresora.nombre], loading, color }
        }
        else {
            output[impresora.nombre] = { loading: true, color }
        }

    })
    return output

}
