const { response, request } = require("express")
const jwt = require("jsonwebtoken")
const { createRefreshToken, createAccessToken } = require("../helpers/generateTokens")
const { Usuario } = require("../models/user")


const validarJWT = async (req = request, res = response, next) => {
    const token = req.header("Authorization")
    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la petición"
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const usuario = await Usuario.findOne({ where: { uid, estado: true } });
        if (!usuario) {
            return res.status(401).json({
                msg: "Usuario no existe en base de datos"
            })
        }
        req.usuario = usuario

        next()
    } catch (e) {
        console.log(e)
        return res.status(401).json({
            msg: "Token no válido"
        })
    }
}
const validarRefreshJWT = async (req = request, res = response, next) => {
    let { id_token, refreshToken } = req.body
    try {
        const { uid } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const usuario = await Usuario.findOne({ where: { uid, estado: true } })
        if (!usuario) {
            return res.status(401).json({
                msg: "Usuario no existe en base de datos",
                verified: false
            })
        }
        let toResponse = { usuario, verification: {} }
        if (usuario.refreshToken === refreshToken) {
            try {
                jwt.verify(id_token, process.env.SECRETORPRIVATEKEY)
            } catch (e) {
                console.log(e);
                id_token = await createAccessToken(uid)
                toResponse.verification.msg = "ID_TOKEN UPDATED"
                toResponse.verification.id_token = id_token
            }
        } else {
            return res.json({
                msg: "Refresh token desconocido",
                verified: false,
            })
        }
        req.toResponse = toResponse
    } catch (e) {
        console.log(e);
        return res.json({
            verified: false,
            msg: "Refresh token Inválido"
        })
    }

    next()
    // if (!token) {
    //     return res.status(401).json({
    //         msg: "No hay token en la petición"
    //     })
    // }
    // try {
    //     const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
    //     const usuario = await Usuario.findOne({ where: { uid, estado: true } });
    //     if (!usuario) {
    //         return res.status(401).json({
    //             msg: "Usuario no existe en base de datos"
    //         })
    //     }
    //     req.usuario = usuario

    //     next()
    // } catch (e) {
    //     console.log(e)
    //     res.status(401).json({
    //         msg: "Token no válido"
    //     })
    // }
}

module.exports = {
    validarJWT,
    validarRefreshJWT
}