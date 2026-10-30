const e = require("express");
const { Carrito } = require("../models/carrito");
const { Usuario } = require("../models/user");

const validarCarritoGet = async (req, res, next) => {
    try {
        const { uid } = req.params
        const usuario = await Usuario.findOne({ where: { uid, estado: true } })
        if (!usuario) {
            return res.status(400).json({ msg: `Usuario con UID: ${uid} no encontrado` })
        }
        const carrito = await Carrito.findAll({ where: { uid, estado: true } })
        req.carrito = carrito
    } catch (e) {
        console.log(e);
        return res.status(400).json({ Errors: e })
    }
    next()
}
const validarCarritoPost = async (req = request, res = response, next) => {
    try {
        const { uid, tid } = req.params
        const usuario = await Usuario.findOne({ where: { uid, estado: true } })
        if (!usuario) {
            return res.status(400).json({ msg: `Usuario con UID: ${uid} no encontrado` })
        }
        const carrito = await Carrito.findOne({ where: { uid, tid } })
        if (carrito && carrito?.estado)
            return res.status(400).json({ msg: "Thing ya existe" })
        req.carrito = carrito

    } catch (e) {
        console.log(e);
        return res.status(400).json({ Errors: e })
    }
    next()
}
const validarCarritoDelete = async (req = request, res = response, next) => {
    try {
        let carrito;
        const { tid, uid, cid } = req.params
        if (tid && uid) {
            const usuario = await Usuario.findOne({ where: { uid, estado: true } })
            if (!usuario)
                return res.status(400).json({ msg: `Usuario con UID: ${uid} no encontrado` })
            carrito = await Carrito.findOne({ where: { tid, uid } })
        } else {
            carrito = await Carrito.findByPk(cid)
        }

        if (!carrito)
            return res.status(400).json({ msg: "Carrito Item no encontrado" })
        req.carrito = carrito
    } catch (e) {
        console.log(e);
        return res.status(400).json({ errors: e })
    }

    next()
}
const validarCarritoPut = async (req = request, res = response, next) => {
    try {
        const { uid, tid } = req.params
        const usuario = await Usuario.findOne({ where: { uid, estado: true } })
        if (!usuario) {
            return res.status(400).json({ msg: `Usuario con UID: ${uid} no encontrado` })
        }
        const carrito = await Carrito.findOne({ where: { tid, uid } })
        if (!carrito)
            return res.status(400).json({ msg: `Thing Item con ID: ${tid} y UID:${tid}  no existe` })
        req.carrito = carrito
    } catch (e) {
        console.log(e);
        return res.status(400).json({ errors: e })
    }
    next()
}

module.exports = {
    validarCarritoGet,
    validarCarritoPost,
    validarCarritoDelete,
    validarCarritoPut
}