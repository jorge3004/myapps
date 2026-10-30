export const jir3dRoles = (user = {}) => {
    const adminFetch =
        user.tipo === "admin" ||
        user.tipo === "dev" ||
        user.usuario === "jorge" ||
        user.correo === "jorgeluis.rivera@upaep.edu.mx"
    return {
        admin:
            adminFetch ||
            user.tipo === "op",
        adminFetch

    }
}