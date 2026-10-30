const { response, request } = require("express")
const { findUser, findDuplicateUser } = require("../helpers/db_Validator");

const validarUsuarioGet = (req = request, res = response, next) => {

}
const validarUsuarioPut = async (req = request, res = response, next) => {
    try {
        const { uid } = req.params

        const { usuario } = req.body
        const userFound = await findUser(uid)
        if (!userFound) {
            return res.status(401).json({
                msg: `El usuario: ${usuario} no existe`
            })
        }
        let usuarioDuplicado = false;
        if (!!usuario)
            usuarioDuplicado = await findDuplicateUser(uid, usuario)
        if (usuarioDuplicado) {
            return res.status(401).json({
                msg: `El usuario: ${usuario} ya existe`
            })
        }
        // return res.json(userFound)
        req.usuario = userFound
        next()
    } catch (e) {
        console.log(e);
        return res.status(401).json({ Error: e })
    }
}

module.exports = {
    validarUsuarioPut,
    validarUsuarioGet
}