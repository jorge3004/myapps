const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { response, request } = require("express");
const { createAccessToken, createRefreshToken } = require("../helpers/generateTokens");
const { googleVerify } = require("../helpers/google-verify");
const { Usuario } = require("../models/user");
const { UUIDV4 } = require("sequelize");

const login = async (req = request, res = response) => {
  const { userName, password } = req.body
  try {
    const user = await Usuario.findOne({ where: { userName } })
    if (!user)
      return res.status(400).json({
        msg: { user: "User does not exist" }
      })
    const validPassword = bcryptjs.compareSync(password, user.password)
    if (!validPassword)
      return res.status(400).json({
        msg: { password: "Wrong password" }
      })
    const clientId = user.clientId
    if (!clientId) {
      Credential.create({ clientId: UUIDV4(), refreshToken: createRefreshToken(), accessToken: createAccessToken() })
    }
    if (user.refreshToken) {
      try {
        jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET)
      } catch (e) {
        console.log(e);
        const refreshToken = await createRefreshToken(user.uid)
        user.update({ ...user, refreshToken })
      }
    } else {
      const refreshToken = await createRefreshToken(user.uid)
      user.update({ ...user, refreshToken })
    }
    const token = await createAccessToken(user.uid)
    res.json({
      usuario: user,
      token,
      refreshToken: user.refreshToken

    });
  } catch (e) {
    console.log(e)
    res.status(500).json({
      msg: { server: "Contact administrator" }
    })
  }
};

const googleSignIn = async (req, res) => {
  const { id_token } = req.body
  let uid;
  try {
    const respGoogle = await googleVerify(id_token)
    const { usuario: user, img, correo } = respGoogle
    let usuario = await Usuario.findOne({
      where: {
        correo, estado: true
      }
    })
    if (!usuario) {
      const data = {
        usuario: correo.substring(0, correo.indexOf("@")),
        nombre: user.split(' ')[0].toLowerCase(),
        correo,
        clave: ":P",
        img,
        google: true
      }
      usuario = new Usuario(data)
      await usuario.save()
    }

    if (usuario.refreshToken) {
      try {
        jwt.verify(usuario.refreshToken, process.env.REFRESH_TOKEN_SECRET)
      } catch (e) {
        console.log(e);
        const refreshToken = await createRefreshToken(usuario.uid)
        usuario.update({ ...usuario, refreshToken })
      }
    } else {
      const refreshToken = await createRefreshToken(usuario.uid)
      usuario.update({ ...usuario, refreshToken })
    }
    const token = await createAccessToken(usuario.uid)
    res.json({
      usuario,
      token,
      refreshToken: usuario.refreshToken
    })
  } catch (e) {
    console.log(e);
    res.status(400).json({
      ok: false,
      msg: "El Token no se pudo verificar"
    })
  }
}
const verification = async (req = request, res = response) => {
  const toResponse = req.toResponse
  try {
    // const validClave = bcryptjs.compareSync(clave, user.clave)
    // if (!validClave) {
    //   return res.status(400).json({
    //     msg: "Clave Invalida"
    //   })
    // }
    res.json(toResponse);
  } catch (e) {
    console.log(e)
    res.status(500).json({
      msg: "Hable con Administrador"
    })
  }
};
module.exports = {
  login,
  googleSignIn,
  verification
};
