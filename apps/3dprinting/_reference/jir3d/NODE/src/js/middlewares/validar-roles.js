const { response } = require("express")

const esAdminRole = (req, res = response, next) => {
    try {
        if (!req.usuario) {
            return res.status(500).json({
                msg: "Se quiere verificar role sin validar token"
            })
        }
        const { role, usuario } = req.usuario

        if (role !== "ADMIN_ROLE") {
            return res.status(401).json({
                msg: `usuario: ${usuario}, no tiene permiso de administrador`
            })
        }
        next()
    } catch (e) {
        console.log(e);
        return res.status(401).json({ Error: e })
    }
}
const tieneRole = (...roles) => (req, res = request, next) => {
    try {
        if (!req.usuario) {
            return res.status(500).json({
                msg: "Se quiere verificar role sin validar token"
            })
        }
        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de los roles: ${roles}`
            })
        }
        next()
    } catch (e) {
        console.log(e);
        return res.status(401).json({ Error: e })
    }

}

module.exports = { esAdminRole, tieneRole }