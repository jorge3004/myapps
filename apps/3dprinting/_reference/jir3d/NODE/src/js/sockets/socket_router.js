const { Router } = require("express");
const { postSocketController } = require("./controller_sockets");

function socketRouter(io) {
    const router = Router()
    router.post("/:nombre", postSocketController(io))
    return router
}


module.exports = socketRouter 