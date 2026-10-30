const { Router } = require("express");
// const { check } = require("express-validator");
// const { validarCampos } = require("../middlewares/validar-campos");
const {
  getRoles,
  // getUsuario,
  // postUsuario,
  // putUsuario,
  // deleteUsuario
} = require("../controllers/roles_controller");

const router = Router();
router.get("/", getRoles);
// router.get("/:id", getUsuario);
// // router.post("/", postUsuario);
// router.post("/", [
//   check("correo", "El correo no es valido").isEmail(),
//   check("clave", "La clave tiene que tener al menos 6 caracteres").isLength({ min: 6 }),
//   check("usuario", "El usuario es obligatorio").not().isEmpty(),
//   check("rol", "No es un rol valido").isIn(["admin", "op"]),
//   validarCampos
// ], postUsuario);
// router.put("/:id", putUsuario);
// router.delete("/:id", deleteUsuario);

module.exports = router;
