import express from 'express';
import userRoutes from './routes/user.router';
import cors from 'cors';
import { mySequelize } from './database/dbConnection';
import User from './model/user.model';

export class Server {
    private app: express.Application;
    private port: string | number;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3001;
        this.middlewares();
        this.routes();
        this.databaseConnection();

    }

    async databaseConnection() {
        try {
            await mySequelize.authenticate()
            await mySequelize.sync({
                alter: true,
                // force: true
            });

            console.log('Connection has been established successfully.');
            const user = await User.findOne({ where: { userName: 'admin' } })
            console.log(user)

            // if (!user) {
            //     await User.create({
            //         userName: 'admin',
            //         email: '

        } catch (e) {
            console.log(e);
            setTimeout(() => {
                this.databaseConnection();
            }, 5000);
        }
    }

    middlewares() {
        this.app.use(cors({}));
        this.app.use(express.json());
    }
    routes() {
        this.app.use('/api/users', userRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port!!! ${this.port}`);
        });
    }

}
const server = new Server();
server.listen();

