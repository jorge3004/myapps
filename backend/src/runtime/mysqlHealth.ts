import pool from '../db';
import { runtimeConfig } from './config';

let cache = {
    value: false,
    checkedAt: 0,
    expiresAt: 0,
    lastCheckDurationMs: null as number | null,
    lastCheckTimedOut: false
};

interface MysqlHealthCheckResult {
    available: boolean;
    durationMs: number;
    timedOut: boolean;
}

async function checkMysqlNow(): Promise<MysqlHealthCheckResult> {
    const timeoutMs = runtimeConfig.mysqlHealthTimeoutMs;
    const startedAt = Date.now();
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('mysql-health-timeout')), timeoutMs);
    });

    try {
        await Promise.race([
            pool.query('SELECT 1'),
            timeoutPromise
        ]);
        return {
            available: true,
            durationMs: Date.now() - startedAt,
            timedOut: false
        };
    } catch (error) {
        return {
            available: false,
            durationMs: Date.now() - startedAt,
            timedOut: error instanceof Error && error.message === 'mysql-health-timeout'
        };
    }
}

export async function isMysqlAvailable(force = false): Promise<boolean> {
    const now = Date.now();
    if (!force && cache.expiresAt > now) {
        return cache.value;
    }

    const result = await checkMysqlNow();
    cache = {
        value: result.available,
        checkedAt: now,
        expiresAt: now + runtimeConfig.mysqlHealthTtlMs,
        lastCheckDurationMs: result.durationMs,
        lastCheckTimedOut: result.timedOut
    };
    return result.available;
}

export interface MysqlHealthCacheInfo {
    cachedValue: boolean;
    timeSinceLastCheck: string | null;
    remaining: string;
    ttl: string;
    timeout: string;
    dbLatency: string | null;
    lastCheckTimedOut: boolean;
}

function formatDuration(ms: number): string {
    if (ms < 1000) {
        return `${ms}ms`;
    }

    if (ms < 60_000) {
        return `${(ms / 1000).toFixed(1)}s`;
    }

    const minutes = Math.floor(ms / 60_000);
    const seconds = Math.floor((ms % 60_000) / 1000);
    return `${minutes}m ${seconds}s`;
}

export function getMysqlHealthCacheInfo(): MysqlHealthCacheInfo {
    const now = Date.now();
    const remainingMs = Math.max(0, cache.expiresAt - now);
    const hasCachedCheck = cache.checkedAt > 0;
    const ageMs = hasCachedCheck
        ? Math.max(0, now - cache.checkedAt)
        : 0;

    return {
        cachedValue: cache.value,
        timeSinceLastCheck: hasCachedCheck ? formatDuration(ageMs) : null,
        remaining: formatDuration(remainingMs),
        ttl: formatDuration(runtimeConfig.mysqlHealthTtlMs),
        timeout: formatDuration(runtimeConfig.mysqlHealthTimeoutMs),
        dbLatency: cache.lastCheckDurationMs === null ? null : formatDuration(cache.lastCheckDurationMs),
        lastCheckTimedOut: cache.lastCheckTimedOut
    };
}
