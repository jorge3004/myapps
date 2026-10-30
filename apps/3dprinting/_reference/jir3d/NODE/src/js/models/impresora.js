const { DataTypes } = require('sequelize');
const { sequelize_JIR3D } = require('../database/connectionDB');


const schema = {
    iid: {
        // field: 'GenreId',
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    price: {
        type: DataTypes.FLOAT,
    },
    nozzleTemp: {
        type: DataTypes.INTEGER,
        defaultValue: 185
    },
    bedTemp: {
        type: DataTypes.INTEGER,
        defaultValue: 40
    },
    bedParam: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    lastSeen: {
        type: DataTypes.STRING,
    },
    comando: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    lastPrint: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    lastAction: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
}

const Impresora = sequelize_JIR3D.define("impresora", schema)

// Impresora.prototype.toJSON = function () {
//     const { clave, refreshToken, ...usuario } = this.dataValues
//     return usuario
// }

module.exports = { Impresora };
