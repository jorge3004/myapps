import pool from '../db';
import { runtimeConfig } from './config';

let cache = {
    value: false,
    expiresAt: 0
};

async function checkMysqlNow(): Promise<boolean> {
    const timeoutMs = runtimeConfig.mysqlHealthTimeoutMs;
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('mysql-health-timeout')), timeoutMs);
    });

    try {
        await Promise.race([
            pool.query('SELECT 1'),
            timeoutPromise
        ]);
        return true;
    } catch {
        return false;
    }
}

export async function isMysqlAvailable(force = false): Promise<boolean> {
    const now = Date.now();
    if (!force && cache.expiresAt > now) {
        return cache.value;
    }

    const value = await checkMysqlNow();
    cache = {
        value,
        expiresAt: now + runtimeConfig.mysqlHealthTtlMs
    };
    return value;
}
