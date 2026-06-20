import { Request, Response, NextFunction } from 'express';
import { resolveRuntimeContext } from '../runtime/resolve';
import { runWithRuntimeContext } from '../runtime/requestContext';

function headerValue(req: Request, name: string): string | undefined {
    const value = req.header(name);
    return value ? String(value).trim().toLowerCase() : undefined;
}

function applyRuntimeHeaders(res: Response, runtime: any): void {
    res.setHeader('x-runtime-env-requested', runtime.requestedEnvironment);
    res.setHeader('x-runtime-env-served', runtime.servedEnvironment);
    res.setHeader('x-data-source-requested', runtime.requestedDataSource);
    res.setHeader('x-data-source-served', runtime.servedDataSource);
    res.setHeader('x-data-source-fallback', runtime.fallbackApplied ? '1' : '0');
    res.setHeader('x-data-source-mysql-available', runtime.mysqlAvailable ? '1' : '0');
}

export async function runtimeContextMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const runtime = await resolveRuntimeContext({
            requestedEnvironment: headerValue(req, 'x-runtime-env'),
            requestedDataSource: headerValue(req, 'x-data-source'),
            method: req.method,
            path: req.path
        });

        runWithRuntimeContext(runtime, () => {
            applyRuntimeHeaders(res, runtime);

            if (!runtime.allowWrite && runtime.operation === 'write') {
                return res.status(503).json({
                    error: 'Primary datasource unavailable for write operations',
                    requestedDataSource: runtime.requestedDataSource,
                    servedDataSource: runtime.servedDataSource,
                    fallbackApplied: runtime.fallbackApplied,
                    reason: runtime.reason
                });
            }

            next();
        });
    } catch (error) {
        next(error);
    }
}
