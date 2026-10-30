// db.ts - Configuración y conexión MySQL para el backend
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

function requireEnv(name: string): string {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

const pool = mysql.createPool({
    host: requireEnv('DB_HOST'),
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_NAME'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;
