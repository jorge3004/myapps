const { Router } = require("express")
const { validarOrdenesGet } = require("../middlewares")
const { getOrdenes } = require("../controllers/ordenes_controller")
const router = Router()

router.get("/:uid", [validarOrdenesGet], getOrdenes);

module.exports = router