
import { Sequelize } from "sequelize";
// import Role from "../model/roles.model";
import User from "../model/user.model";
import Role from "../model/roles.model";
// import UserModel from "../model/creden.model";
// import Role from "../model/creden.model";
// import bcryptjs from "bcryptjs";
// import { v4 as uuidv4 } from 'uuid';


// const reconnectOptions = {
//     max_retries: 999,
//     onRetry: function (count) {
//         console.log("connection lost, trying to reconnect (" + count + ")");
//     }
// };

export const mySequelize = new Sequelize(
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
        // reconnect: reconnectOptions || true,
        logging: false,
        timezone: '-06:00'
    }
    // MYSQL_PUBLISHED_PORT=3306
    // MYSQL_TARGET_PORT=3306
    // MYSQL_ROOT_PASSWORD=root
);
export async function initDbConnection() {
    try {
        await mySequelize.authenticate()
        // await User.sync({
        //     alter: true,
        //     force: true
        // }); ``
        // await Role.sync({
        //     alter: true,
        //     force: true
        // });
        console.log("DataBase Online");
    } catch (e) {
        console.log(e);
        setTimeout(() => {
            initDbConnection();
        }, 5000);
    }

    // try {

    //     // const user = await User.findOne({ where: { userName: 'admin' } })
    //     // console.log(user)
    //     // // const credential = await Credential.findOne({ where: { clienId: 'admin' } })
    //     // if (!user) {
    //     //     // const salt = bcryptjs.genSaltSync()
    //     //     // const password = bcryptjs.hashSync('admin', salt)
    //     //     // const id = uuidv4()
    //     //     await User.create({
    //     //         id: 23234,
    //     //         userName: 'admin',
    //     //     })
    //     //     await Credential.create({
    //     //         clientId: 'admin',
    //     //         // clientId: uuidv4(),
    //     //         userId: "id",
    //     //         password: "admin",
    //     //         // refreshToken,
    //     //         // password,
    //     //     })
    //     // }
    //     console.log("DataBase Online")

    // } catch (e) {
    //     console.log(e);
    //     // console.log("reconnecting ..." + e);
    //     setTimeout(() => {
    //         initDbConnection()
    //     }, 5000);
    // }
}





