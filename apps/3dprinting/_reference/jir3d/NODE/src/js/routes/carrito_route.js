const { Router } = require("express");
// const { check } = require("express-validator");
const {
  getCarrito,
  postCarrito,
  putCarrito,
  deleteCarrito
} = require("../controllers/carrito_controller");

const {
  validarCarritoPut,
  validarCarritoGet,
  validarCarritoPost,
  validarCarritoDelete,
  // cors
} = require("../middlewares")

const router = Router();
router.get("/:uid",
  validarCarritoGet,
  // cors,
  getCarrito);
router.post("/:uid/:tid", [
  validarCarritoPost,
  // cors,
], postCarrito);
router.put("/:uid/:tid", [
  validarCarritoPut,
  // cors
], putCarrito);
router.delete("/:uid/:tid", [
  validarCarritoDelete,
], deleteCarrito);
router.delete("/:cid", [
  validarCarritoDelete,
], deleteCarrito);

module.exports = router;
