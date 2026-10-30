const { DataTypes } = require('sequelize');
const { sequelize_JIR3D } = require('../database/connectionDB');

const schema = {
    id: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true
        // type: DataTypes.UUID,
        // autoIncrement: true,
        // allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
    },
    // status: {
    //     type: DataTypes.STRING,
    //     default: 'Offline',
    // },
    // refreshToken: {
    //     type: DataTypes.STRING,
    // },
}


const User = sequelize_JIR3D.define("user", schema)
// const User = sequelize_JIR3D.define("user", schema, { schema: 'credential' })


// User.prototype.toJSON = function () {
//     const { password, ...user } = this.dataValues
//     return user
// }

// Usuario.prototype.toJSONClave = function () {
//     const { refreshToken, ...usuario } = this.dataValues
//     // usuario.uid = usuario.id;
//     return usuario
// }

// schema.toJson = function () {
//     const { clave, ...usuario } = this.toObject()
//     return usuario
// }

module.exports = { User };
