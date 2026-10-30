const { DataTypes } = require('sequelize');
const { sequelize_JIR3D } = require('../database/connectionDB');


const schema = {
    rid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    x: {
        type: DataTypes.FLOAT,
    },
    y: {
        type: DataTypes.FLOAT,
    },
    z: {
        type: DataTypes.FLOAT,
    },
    time: {
        type: DataTypes.INTEGER,
    },
    grams: {
        type: DataTypes.FLOAT,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    gcode: {
        type: DataTypes.BLOB('long')
    },
    tsrc: {
        type: DataTypes.STRING,
    },
    tlink: {
        type: DataTypes.STRING,
    },
    ttitle: {
        type: DataTypes.STRING,
    },
    uploadPath: {
        type: DataTypes.STRING,
    },
    desc: {
        type: DataTypes.STRING,
    }
}

const Repositorio = sequelize_JIR3D.define("repositorio", schema, {
    freezeTableName: true
})

// Impresora.prototype.toJSON = function () {
//     const { clave, refreshToken, ...usuario } = this.dataValues
//     return usuario
// }

module.exports = { Repositorio };
