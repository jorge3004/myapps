const { DataTypes } = require('sequelize');
const { sequelize_JIR3D } = require('../database/connectionDB');


const schema = {
    clientId: {
        type: DataTypes.UUID,
        // type: DataTypes.UUID,
        // autoIncrement: true,
        // allowNull: false,
        unique: true,
        primaryKey: true
    },
    refreshToken: {
        type: DataTypes.STRING,
    },
    accessToken: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    userId: {
        type: DataTypes.STRING,
    },
    // status: {
    //     type: DataTypes.STRING,
    //     default: 'Offline',
    // },
}


const Credential = sequelize_JIR3D.define("credential", schema)

module.exports = { Credential };
