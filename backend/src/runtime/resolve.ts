import { runtimeConfig } from './config';
import { isMysqlAvailable } from './mysqlHealth';
import { DataSource, RuntimeOperation, RuntimeResolutionInput, RuntimeResolvedContext } from './types';

function normalizePath(path?: string): string {
    if (!path) return '';
    const withoutQuery = path.split('?')[0] || '';
    return withoutQuery.toLowerCase();
}

function normalizeOperation(method: string, path?: string): RuntimeOperation {
    const upper = (method || '').toUpperCase();
    const normalizedPath = normalizePath(path);
    const readSemanticPostRoutes = new Set(runtimeConfig.readSemanticPostRoutes);

    // Some endpoints use POST for credential exchange but do not mutate state.
    if (upper === 'POST' && readSemanticPostRoutes.has(normalizedPath)) {
        return 'read';
    }

    return upper === 'GET' || upper === 'HEAD' || upper === 'OPTIONS' ? 'read' : 'write';
}

function normalizeDataSource(value: string | undefined): DataSource {
    return value === 'memory' ? 'memory' : 'mysql';
}

export async function resolveRuntimeContext(input: RuntimeResolutionInput): Promise<RuntimeResolvedContext> {
    const operation = normalizeOperation(input.method, input.path);

    const requestedEnvironment = (input.requestedEnvironment || runtimeConfig.defaultEnvironment).toLowerCase();
    const servedEnvironment = runtimeConfig.allowedEnvironments.includes(requestedEnvironment)
        ? requestedEnvironment
        : runtimeConfig.defaultEnvironment;

    const requestedDataSourceRaw: DataSource = normalizeDataSource(input.requestedDataSource);
    const requestedDataSource: DataSource = runtimeConfig.allowedDataSources.includes(requestedDataSourceRaw)
        ? requestedDataSourceRaw
        : runtimeConfig.defaultDataSource;

    const mysqlAvailable = await isMysqlAvailable();
    let servedDataSource: DataSource = requestedDataSource;
    let fallbackApplied = false;
    let allowWrite = true;
    let reason: string | undefined;

    if (requestedDataSource === 'mysql' && !mysqlAvailable) {
        if (operation === 'read' && runtimeConfig.fallbackReadToMemory && runtimeConfig.allowedDataSources.includes('memory')) {
            servedDataSource = 'memory';
            fallbackApplied = true;
            reason = 'mysql_unavailable_read_fallback_memory';
        } else {
            servedDataSource = 'mysql';
            allowWrite = false;
            reason = operation === 'write'
                ? 'mysql_unavailable_write_blocked'
                : 'mysql_unavailable_no_fallback';
        }
    }

    return {
        requestedEnvironment,
        servedEnvironment,
        requestedDataSource,
        servedDataSource,
        operation,
        fallbackApplied,
        mysqlAvailable,
        allowWrite,
        reason
    };
}
