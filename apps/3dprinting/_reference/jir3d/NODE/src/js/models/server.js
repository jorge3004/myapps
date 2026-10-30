require("dotenv").config();
const fileUpload = require('express-fileupload')
const express = require("express");
const { sequelize_JIR3D } = require("../database/connectionDB");
const cors = require("cors");
const { User } = require("./user");
const bcryptjs = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const { Credential } = require("./credential");


const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

class Server {
  constructor() {
    this.app = express();
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server, {
      cors: {
        origin: "*"
      }
    });
    // this.socketRouter = require("../sockets/socket_router")(this.io)
    this.port =
      3001 //local
    // process.env.NODE_TARGET_PORT //from .env
    // this.dbConnection();
    // this.middlewares();
    this.routes();
    // this.sockets()
  }
  middlewares() {
    this.app.use(cors(corsOptions))
    this.app.use(express.json());
    // this.app.use(express.static("./src/public"));
    this.app.use(fileUpload({
      createParentPath: true,
      useTempFiles: true,
      tempFileDir: '/tmp/'
    }));

  }
  async dbConnection() {
    try {
      await sequelize_JIR3D.authenticate();
      await sequelize_JIR3D.sync({
        alter: true,
        force: true
      })
      const user = await User.findOne({ where: { userName: 'admin' } })
      // const credential = await Credential.findOne({ where: { clienId: 'admin' } })
      if (!user) {
        const salt = bcryptjs.genSaltSync()
        const password = bcryptjs.hashSync('admin', salt)
        const id = uuidv4()
        await User.create({
          id,
          userName: 'admin',
        })
        await Credential.create({
          clientId: uuidv4(),
          userId: id,
          refreshToken,
          password,
        })
      }
      console.log("DataBase Online")
    } catch (e) {
      console.log("reconnecting ...");
      setTimeout(() => {
        this.dbConnection()
      }, 5000);
    }
  }
  routes() {
    // this.app.use("/auth", require("../routes/auth_route"));
    // this.app.use("/USERS", require("../routes/usuarios_route"));
    // this.app.use("/roles", require("../routes/roles_route"));
    // this.app.use("/impresoras", require("../routes/impresoras_route"));
    // this.app.use("/carrito", require("../routes/carrito_route"));
    // this.app.use("/ordenes", require("../routes/ordenes_route"));
    // this.app.use("/repositorio", require("../routes/repositorio_route"));
    // this.app.use("/files", require("../routes/files_route"));
    // this.app.use("/broadcast", this.socketRouter);
    // this.app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html') });
    this.app.get('/', (req, res) => res.send('Jir3d API Page'));
  }
  sockets() {
    this.io.on('connection', require("../sockets/controller_sockets"));
  }

  listen() {
    this.server.listen(this.port, (err) => {
      if (err) throw new Error(err);
      console.log("app escuchando en puerto: " + this.port);
    });
  }
}
module.exports = { Server };