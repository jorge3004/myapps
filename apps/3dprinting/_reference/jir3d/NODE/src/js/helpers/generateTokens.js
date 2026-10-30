const jwt = require("jsonwebtoken")

const createAccessToken = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid }
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "1h"
            // expiresIn: "4h"
        }, (err, token) => {
            if (err) {
                console.log(err)
                reject("No se pudo generar el token")
            } else {
                resolve(token)
            }
        })
    })
}
const createRefreshToken = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid }
        jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, (err, token) => {
            if (err) {
                console.log(err)
                reject("No se pudo generar el token")
            } else {
                resolve(token)
            }
        })
    })
}
module.exports = {
    createAccessToken,
    createRefreshToken
};