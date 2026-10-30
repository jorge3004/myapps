const { response, request } = require("express");
const bcryptjs = require('bcryptjs')
const { Role } = require("../models/role");

// const getUsuarios = async (req = request, res = response) => {
//     const usuarios = await Usuario.findAll()
//     res.json(usuarios);
// };
const getRoles = async (req = request, res = response) => {
    const usuarios = await Role.findAll()
    res.json(usuarios);
    // const { id } = req.params
    // const usuario = await Roles.findByPk(id)
    // if (usuario) {
    //     res.json(usuario);
    // } else {
    //     res.status(404).json({ msg: `No existe un usuario con el id ${id}` })
    // }
    // res.send("isdik")
};
// const postUsuario = async (req = request, res = response) => {

//     const { noUsado, ...body } = req.body
//     // const { usuario,clave } = req.body
//     // const { body } = req
//     try {
//         const existeUsuario = await Usuario.findOne({
//             where: {
//                 usuario: body.usuario
//             }
//         })
//         if (existeUsuario) {
//             return res.status(400).json({
//                 msg: "Ya existe un usuario " + body.usuario
//             })
//         }
//         const usuario = new Usuario(body)
//         const salt = bcryptjs.genSaltSync()
//         usuario.clave = bcryptjs.hashSync(body.clave, salt)
//         await usuario.save()
//         res.json(usuario)
//     } catch (e) {
//         console.log(e)
//         res.status(500).json({ msg: "Contacta Administrador" })
//     }

//     // res.json(rest)
// };
// const putUsuario = async (req, res = response) => {
//     const { id } = req.params
//     const { body } = req
//     try {
//         const usuario = await Usuario.findByPk(id);
//         if (!usuario) {
//             return res.status(404).json({
//                 msg: "No existe usuario con id: " + id
//             })
//         }
//         if (body.clave) {
//             const salt = bcryptjs.genSaltSync()
//             body.clave = bcryptjs.hashSync(body.clave, salt)
//         }
//         await usuario.update(body)
//         res.json(usuario)

//     } catch (e) {
//         console.log(e)
//         res.status(500).json({ msg: "Contacta Administrador" })
//     }
// };
// const deleteUsuario = async (req, res = response) => {
//     const { id } = req.params
//     const { body } = req
//     try {
//         const usuario = await Usuario.findByPk(id);
//         if (!usuario) {
//             return res.status(404).json({
//                 msg: "No existe usuario con id: " + id
//             })
//         }
//         // await usuario.destroy()
//         await usuario.update({ estado: false })
//         res.json(usuario)

//     } catch (e) {
//         console.log(e)
//         res.status(500).json({ msg: "Contacta Administrador" })
//     }
// };
module.exports = {
    getRoles,
    // getUsuario,
    // postUsuario,
    // putUsuario,
    // deleteUsuario
};
