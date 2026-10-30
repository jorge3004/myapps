import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4100);

app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ app: '3dprinting-backend', status: 'ok' });
});

app.listen(port, () => {
    console.log(`3DPrinting backend listening on port ${port}`);
});
