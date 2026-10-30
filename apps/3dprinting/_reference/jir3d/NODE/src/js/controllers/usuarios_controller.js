const { response, request } = require("express");
const bcryptjs = require('bcryptjs')
const { Usuario } = require("../models/users");
const { findUserByPk } = require("../helpers/db_Validator");


const getUsuarios = async (req = request, res = response) => {
    // const { admin } = req.query
    // const { uid } = req.params
    // const adminCheck = admin === "true"
    const { per_page = null } = req.query
    let arg = per_page === null ? {} : (per_page !== "" && Number.isInteger(Number(per_page))) ? { limit: Number(per_page) } : false
    if (arg) {
        const { limit = null } = arg
        let fJson = {}
        arg.where = { estado: true }
        if (limit === null) {
            // if (admin) {
            const { count, rows } = await Usuario.findAndCountAll(arg)
            fJson = { total: count, usuarios: rows }
            // } else {
            //     const { count, rows } = await Usuario.findAll({
            //         where: { estado: true, [Op.or]: [{ createdBy: uid }, { uid }] }, attributes: ['uid']
            //     })
            //     fJson = { total: count, usuarios: rows }
            // }
        } else {
            const usuarios = await Usuario.findAll(arg)
            fJson = { total: Object.keys(usuarios).length, usuarios }
        }
        res.json(fJson);
    } else {
        return res.status(404).json({
            msg: "param per_page debe ser numero"
        })
    }
};
const getUsuario = async (req = request, res = response) => {
    try {
        const { uid } = req.params
        const usuario = await findUserByPk(uid)
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ msg: `No existe un usuario con el id ${id}` })
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({ Error: e })
    }
};
const postUsuario = async (req = request, res = response) => {
    const { noUsado, ...body } = req.body
    // const { usuario,clave } = req.body
    try {
        const usuario = new Usuario(body)
        const salt = bcryptjs.genSaltSync()
        usuario.clave = bcryptjs.hashSync(body.clave, salt)
        const resp = await usuario.save()
        res.json(usuario)
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: "Contacta Administrador" })
    }
};
const putUsuario = async (req = request, res = response) => {
    let inputValues = req.body
    const usuario = req.usuario
    if (!req.body?.clave) {
        const { clave, ...inputValues2 } = inputValues
        inputValues = inputValues2
    }
    const newUser = { ...usuario, ...inputValues }
    try {
        if (inputValues.clave) {
            const salt = bcryptjs.genSaltSync()
            newUser.clave = bcryptjs.hashSync(inputValues.clave, salt)
        }
        await usuario.update(newUser)
        const { clave, ...output } = newUser.dataValues // Quita clave
        res.json(output)
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: "Contacta Administrador" })
    }
};
const deleteUsuario = async (req, res = response) => {
    const { uid } = req.params
    const usuarioAutenticado = req.usuario
    try {
        const usuario = await findUserByPk(uid);
        // await usuario.destroy()
        await usuario.update({ estado: false })
        res.json({ usuario, usuarioAutenticado })

    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: "Contacta Administrador" })
    }
};
module.exports = {
    getUsuarios,
    getUsuario,
    postUsuario,
    putUsuario,
    deleteUsuario
};
