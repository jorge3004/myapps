import { DataSource } from './types';

interface RuntimeConfig {
    defaultEnvironment: string;
    allowedEnvironments: string[];
    defaultDataSource: DataSource;
    allowedDataSources: DataSource[];
    readSemanticPostRoutes: string[];
    fallbackReadToMemory: boolean;
    mysqlHealthTtlMs: number;
    mysqlHealthTimeoutMs: number;
}

function parseCsv(value: string | undefined, fallback: string[]): string[] {
    if (!value) return fallback;
    const parsed = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    return parsed.length > 0 ? parsed : fallback;
}

function parseDataSources(value: string | undefined): DataSource[] {
    const allowed = parseCsv(value, ['mysql', 'memory']);
    const filtered = allowed.filter((item): item is DataSource => item === 'mysql' || item === 'memory');
    return filtered.length > 0 ? filtered : ['mysql', 'memory'];
}

const defaultEnvironment = (process.env.RUNTIME_ENV || process.env.NODE_ENV || 'dev').toLowerCase();
const allowedEnvironments = parseCsv(process.env.ALLOWED_RUNTIME_ENVS, [defaultEnvironment, 'dev', 'prod']);
const allowedDataSources = parseDataSources(process.env.ALLOWED_DATA_SOURCES);
const defaultDataSource: DataSource =
    (process.env.DATA_SOURCE || 'mysql').toLowerCase() === 'memory' ? 'memory' : 'mysql';
const readSemanticPostRoutes = parseCsv(
    process.env.READ_SEMANTIC_POST_ROUTES,
    ['/api/auth/login', '/api/auth/token']
).map((route) => route.toLowerCase());

export const runtimeConfig: RuntimeConfig = {
    defaultEnvironment,
    allowedEnvironments,
    defaultDataSource,
    allowedDataSources,
    readSemanticPostRoutes,
    fallbackReadToMemory: (process.env.FALLBACK_READ_TO_MEMORY || 'true').toLowerCase() === 'true',
    mysqlHealthTtlMs: Number(process.env.MYSQL_HEALTH_TTL_MS || 10000),
    mysqlHealthTimeoutMs: Number(process.env.MYSQL_HEALTH_TIMEOUT_MS || 3500)
};
