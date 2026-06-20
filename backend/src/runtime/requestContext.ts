import { AsyncLocalStorage } from 'async_hooks';
import { runtimeConfig } from './config';
import { DataSource, RuntimeResolvedContext } from './types';

interface RequestContextStore {
    runtime: RuntimeResolvedContext;
}

const requestContext = new AsyncLocalStorage<RequestContextStore>();

function buildDefaultContext(): RuntimeResolvedContext {
    const servedDataSource: DataSource = runtimeConfig.defaultDataSource === 'memory' ? 'memory' : 'mysql';
    return {
        requestedEnvironment: runtimeConfig.defaultEnvironment,
        servedEnvironment: runtimeConfig.defaultEnvironment,
        requestedDataSource: servedDataSource,
        servedDataSource,
        operation: 'read',
        fallbackApplied: false,
        mysqlAvailable: true,
        allowWrite: true
    };
}

export function runWithRuntimeContext(runtime: RuntimeResolvedContext, callback: () => void): void {
    requestContext.run({ runtime }, callback);
}

export function getRuntimeContext(): RuntimeResolvedContext {
    return requestContext.getStore()?.runtime || buildDefaultContext();
}
