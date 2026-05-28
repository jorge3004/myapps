import express from 'express';
import { userService } from 'user-management';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

import userRoutes from './routes/userRoutes';
app.use('/users', userRoutes);


app.get('/', async (_req, res) => {
    // Ejemplo: crear un usuario de prueba y devolverlo
    const testUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashedpassword123'
    };
    await userService.register(testUser);
    const user = await userService.getUserById('1');
    res.json({
        message: 'Catalog Backend TS funcionandoo',
        user
    });
});

export { app, port };
