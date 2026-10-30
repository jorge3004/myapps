require("dotenv").config();
const { Sequelize } = require('sequelize');

var reconnectOptions = {
    max_retries: 999,
    onRetry: function (count) {
        console.log("connection lost, trying to reconnect (" + count + ")");
    }
};
const sequelize_JIR3D = new Sequelize(
    // process.env.MYSQL_DATABASE //from .env
    "jirdcom_DB" //local
    ,
    //process.env.MYSQL_USER //from .env
    "jirdcom_USER" //local
    ,
    //process.env.MYSQL_PASSWORD //from .env
    "REDACTED" //local
    ,
    {
        host:
            'db' //local
        // 'jir3d.com.' //for server
        // process.env.MYSQL_HOST //from .env
        ,
        dialect: "mysql",
        reconnect: reconnectOptions || true,
        logging: false,
        timezone: '-06:00'
    }
    // MYSQL_PUBLISHED_PORT=3306
    // MYSQL_TARGET_PORT=3306
    // MYSQL_ROOT_PASSWORD=root
)


module.exports = { sequelize_JIR3D };
