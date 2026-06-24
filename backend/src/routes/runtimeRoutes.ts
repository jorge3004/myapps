import { Router } from 'express';
import { getRuntimeConfig, getRuntimeInfo } from '../repositories';
import { getMysqlHealthCacheInfo, isMysqlAvailable } from '../runtime/mysqlHealth';

const router = Router();

async function getRuntimeForDiagnostics() {
    const runtime = getRuntimeInfo();
    const isDynamic = runtime.reason !== 'runtime_context_default_no_health_check';

    if (isDynamic) {
        return {
            runtime,
            runtimeContextDynamic: true,
            runtimeContextNote: null
        };
    }

    const mysqlAvailable = await isMysqlAvailable();
    return {
        runtime: {
            ...runtime,
            mysqlAvailable
        },
        runtimeContextDynamic: false,
        runtimeContextNote: 'runtimeContextMiddleware is disabled; mysqlAvailable is an on-demand check for this request'
    };
}

router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

router.get('/runtime/status', async (_req, res) => {
    const diagnostics = await getRuntimeForDiagnostics();
    const runtime = diagnostics.runtime;
    const config = getRuntimeConfig();
    const mysqlHealthCache = getMysqlHealthCacheInfo();

    res.json({
        status: 'ok',
        current: {
            requestedEnvironment: runtime.requestedEnvironment,
            servedEnvironment: runtime.servedEnvironment,
            requestedDataSource: runtime.requestedDataSource,
            servedDataSource: runtime.servedDataSource,
            fallbackApplied: runtime.fallbackApplied,
            mysqlAvailable: runtime.mysqlAvailable,
            operation: runtime.operation,
            reason: runtime.reason || null
        },
        runtimeContext: {
            dynamic: diagnostics.runtimeContextDynamic,
            note: diagnostics.runtimeContextNote
        },
        defaults: {
            environment: config.defaultEnvironment,
            dataSource: config.defaultDataSource
        },
        available: {
            environments: config.allowedEnvironments,
            dataSources: config.allowedDataSources
        },
        policy: {
            fallbackReadToMemory: config.fallbackReadToMemory,
            readSemanticPostRoutes: config.readSemanticPostRoutes
        },
        mysqlHealthCache
    });
});

export default router;