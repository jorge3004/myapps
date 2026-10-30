const { request, response } = require("express");

const getOrdenes = (req = request, res = response) => {
    try {
        res.json(req.ordenes)
    } catch (e) {
        console.log(e);
        res.status(500).json({ msg: "Contacte Administrador" })
    }
}
module.exports = { getOrdenes }