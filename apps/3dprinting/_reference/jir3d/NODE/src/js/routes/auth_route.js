const { Router } = require("express");
const { check } = require("express-validator")
const {
  login,
  // googleSignIn, 
  // verification
} = require("../controllers/auth_controller");
// const {
//   validarRefreshJWT, validarCampos
// } = require("../middlewares");

const router = Router();
router.post("/", [
  // check("usuario", "El usuario es obligatorio").not().isEmpty(),
  // check("clave", "La clave es obligatorio").not().isEmpty(),
  // validarCampos,
], login);

// router.post("/google", [
//   check("id_token", "id_token es necesario").not().isEmpty(),
//   validarCampos,
// ], googleSignIn);

// router.post("/verification", [
//   validarRefreshJWT,
//   validarCampos,
// ], verification);

module.exports = router;
