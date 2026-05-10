// Modularizado: importar y exportar controladores
module.exports = {
    ...require('./user/authController'),
    ...require('./user/profileController'),
    ...require('./user/registrationController'),
    ...require('./user/approvalController'),
    ...require('./user/getUserByIdController'),
};
