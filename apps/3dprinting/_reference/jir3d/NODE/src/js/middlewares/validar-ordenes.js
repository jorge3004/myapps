const { request, response } = require("express");
const { Op } = require("sequelize");
const { Carrito } = require("../models/carrito");
const { Usuario } = require("../models/user");

const validarOrdenesGet = async (req = request, res = response, next) => {
    try {
        const { admin } = req.query
        const { uid } = req.params
        const adminCheck = (admin === 'true')
        const usuario = await Usuario.findOne({ where: { uid, estado: true } })
        if (!usuario)
            return res.status(400).json({ msg: `usuario con UID:${uid} no existe` })
        let ordenes = {}
        if (adminCheck)
            ordenes = await Carrito.findAll({ where: { estado: true, uploaded: false } })
        else {
            const usuarios = await Usuario.findAll({
                where: { estado: true, [Op.or]: [{ createdBy: uid }, { uid }] }, attributes: ['uid']
            })
            const usuariosArray = usuarios.map(item => item.dataValues)
            ordenes = await Carrito.findAll({ where: { uploaded: false, estado: true, [Op.or]: usuariosArray } })
        }
        req.ordenes = ordenes
    } catch (e) {
        console.log(e);
        return res.json({ msg: "Error showAllSchemas" })
    }
    // db_carrito.query('show tables').then(oro => {
    //     console.log(oro);
    // });
    next()
}
module.exports = { validarOrdenesGet }