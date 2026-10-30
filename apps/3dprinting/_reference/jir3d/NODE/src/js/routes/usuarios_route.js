const { Router } = require("express");
const { check } = require("express-validator");
const { esRoleValido, emailExiste, existeUsuarioPorId, usuarioExiste } = require("../helpers/db_Validator");
// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");
const {
  validarCampos,
  validarUsuarioPut,
  validarUsuarioGet
  // validarJWT,
  // tieneRole
} = require("../middlewares")
const {
  getUsuarios,
  getUsuario,
  postUsuario,
  putUsuario,
  deleteUsuario
} = require("../controllers/usuarios_controller");

const router = Router();
router.get("/", getUsuarios);
// router.get("/:uid", getUsuarios);
router.get("/:uid", getUsuario);
router.post("/", [
  // check("correo", "El correo no es valido").isEmail(),
  // check("correo").custom(emailExiste),
  check("usuario").custom(usuarioExiste),
  // check("clave", "La clave tiene que tener al menos 6 caracteres").isLength({ min: 6 }),
  check("usuario", "El usuario es obligatorio").not().isEmpty(),
  // check("role").custom(esRoleValido),
  // check("role", "No es un role valido").isIn(["admin", "op"]),
  validarCampos
], postUsuario);
router.put("/:uid", [
  // check("uid").custom(existeUsuarioUpdate),
  validarUsuarioPut,
], putUsuario);
router.delete("/:uid", [
  // validarJWT,
  // tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
  // esAdminRole, //Debe tener validarJWT antes
  check("uid").custom(existeUsuarioPorId),
  validarCampos
], deleteUsuario);

module.exports = router;
