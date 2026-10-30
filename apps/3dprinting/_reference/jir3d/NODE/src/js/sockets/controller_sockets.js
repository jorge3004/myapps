// const { json } = require("express");
const { findUserByPk } = require("../helpers/db_Validator");
const { Impresora } = require("../models/impresora");

const socketController = (client) => {
    // console.log(client.id, "Cliente conectado");
    client.on('disconnect', () => {
        console.log(client.id, "Cliente desconectado");
    });
    client.on('jir3dUserConnected', async ({ uid, lastConnection }, callback) => {
        console.log(client.id, "Cliente conectado");
        const user = await findUserByPk(uid)
        // const lastConnection = currentCentralTime
        // const newUser = { ...usuario, ...inputValues }
        // try {
        const payload = { socketId: client.id, lastConnection, connected: true }
        await user.update(payload)
        // console.log(payload)
        //     // const { clave, ...output } = newUser.dataValues // Quita clave
        //     // res.json(output)
        // } catch (e) {
        //     console.log(e)
        //     // res.status(500).json({ msg: "Contacta Administrador" })
        // }
        // callback("Todo salió bien")
        // client.broadcast.emit("create-something", value)
    });

    // setInterval(() => {
    //     client.emit("watchDog", "hola")
    // }, 1000);
}

const postSocketController = (io) => async (req, res) => {
    const { nombre } = req.params
    try {
        const printer = await Impresora.findOne({ where: { nombre } })
        const { comando, lastPrint } = printer
        if (!printer)
            return res.status(400).json({ msg: "Printer not found" })
        if (printer.isActive)
            io.emit("create-something", { ...req.body._octoprint_API, nombre: printer.dataValues.nombre })
        // io.emit("create-something", { ...printer.dataValues, ...req.body })
        if (comando !== "")
            await printer.update({ comando: "" })
        if (comando === "imprimir") {
            return res.json({ comando, lastPrint })
        }
        res.json({ comando })
    } catch (e) {
        res.json({ msg: e })
    }
}

module.exports = {
    socketController,
    postSocketController
}