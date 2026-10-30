// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");
const validarCampos = require("./validar-campos");
const validarJWT = require("./validar-jwt");
const validarRoles = require("./validar-roles");
const validarUsuario = require("./validar-usuario");
const validarImpresora = require("./validar-impresora");
const validarCarrito = require("./validar-carrito");
const validarOrdenes = require("./validar-ordenes");
const validarFile = require("./validar-file");
const cors = require("./cors");
module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarUsuario,
    ...validarImpresora,
    ...validarCarrito,
    ...validarOrdenes,
    ...validarFile,
    ...cors
}