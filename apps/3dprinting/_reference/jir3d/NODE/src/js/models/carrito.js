const { DataTypes } = require('sequelize');
const { sequelize_JIR3D } = require('../database/connectionDB');


const schema = {
    cid: {
        // field: 'GenreId',
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    uid: {
        type: DataTypes.INTEGER,
    },
    thumbnail: {
        type: DataTypes.STRING,
    },
    tid: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        // primaryKey: true
    },
    ttitle: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    tlink: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    tlinkedit: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    files_url: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    jir3d: {
        type: DataTypes.BOOLEAN,
    },
    tsrc: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    query: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    uploaded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}



const Carrito = sequelize_JIR3D.define("carrito", schema)

// Impresora.prototype.toJSON = function () {
//     const { clave, refreshToken, ...usuario } = this.dataValues
//     return usuario
// }

module.exports = { Carrito };