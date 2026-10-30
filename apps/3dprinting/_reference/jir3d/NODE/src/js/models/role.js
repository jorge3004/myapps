const { DataTypes } = require('sequelize');
const { sequelize_JIR3D } = require('../database/connectionDB');


const schema = {
    role: {
        type: DataTypes.STRING,
        required: true
    },
}
const Role = sequelize_JIR3D.define("role", schema)

module.exports = { Role };
