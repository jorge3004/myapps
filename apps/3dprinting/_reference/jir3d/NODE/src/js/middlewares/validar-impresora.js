const { response, request } = require("express")
const { Op } = require("sequelize");
const { Impresora } = require("../models/impresora");



const validarImpresoraDelete = async (req = request, res = response, next) => {
    try {
        const { iid } = req.params
        const existeImpresora = await Impresora.findOne({ where: { iid, estado: true } })
        if (!existeImpresora) {
            return res.status(401).json({
                msg: `La impresora con id: ${iid} no existe`
            })
        }
        req.impresora = existeImpresora
        next()
    } catch (e) {
        console.log(e);
        return res.status(401).json({ error: e })
    }
}
const validarImpresoraPost = async (req = request, res = response, next) => {
    try {
        let impresoraReq = req.body
        if (!impresoraReq.nombre)
            return res.status(401).json({
                msg: `La parametro nombre no definido`
            })

        const printerFound = await Impresora.findOne({ where: { nombre: impresoraReq.nombre } })

        if (printerFound) {
            if (printerFound.estado) {
                return res.status(401).json({
                    msg: `La impresora: ${impresoraReq.nombre} ya existe`
                })
            } else {
                req.found = true
                req.impresora = printerFound
            }
        } else
            req.found = false
        next()
    } catch (e) {
        console.log(e);
        return res.status(401).json({ Erro: e })
    }
}
const validarImpresoraUpdate = async (req = request, res = response, next) => {
    try {
        const { iid } = req.params
        let { nombre } = req.body
        const printerFound = await Impresora.findOne({ where: { iid, estado: true } })
        if (!printerFound)
            return res.status(401).json({
                msg: `La impresora: ${nombre} no existe`
            })
        if (nombre) {
            const printerDuplicate = await Impresora.findOne({ where: { iid: { [Op.ne]: iid }, nombre: nombre } })
            if (printerDuplicate)
                return res.status(401).json({
                    msg: `La impresora: ${nombre} ya existe`
                })
        }
        req.impresora = printerFound
        next()
    } catch (e) {
        console.log(e);
        return res.status(401).json({ error: e })
    }
}

module.exports = {
    validarImpresoraDelete, validarImpresoraPost, validarImpresoraUpdate
}