const { Router } = require("express");
// const { check } = require("express-validator");
const {
  validarImpresoraDelete,
  validarImpresoraPost,
  validarImpresoraUpdate
} = require("../middlewares")
const {
  getImpresoras,
  getImpresora,
  postImpresora,
  putImpresora,
  deleteImpresora
} = require("../controllers/impresoras_controller");

const router = Router();
router.get("/", getImpresoras);
router.get("/:iid", getImpresora);
router.post("/", [
  validarImpresoraPost,
], postImpresora);
router.delete("/:iid", [
  validarImpresoraDelete,
], deleteImpresora);
router.put("/:iid", [
  validarImpresoraUpdate
], putImpresora);

module.exports = router;
