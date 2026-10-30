export type DataSource = 'mysql' | 'memory';
export type RuntimeOperation = 'read' | 'write';

export interface RuntimeResolutionInput {
    requestedEnvironment?: string | undefined;
    requestedDataSource?: string | undefined;
    method: string;
    path?: string;
}

export interface RuntimeResolvedContext {
    requestedEnvironment: string;
    servedEnvironment: string;
    requestedDataSource: DataSource;
    servedDataSource: DataSource;
    operation: RuntimeOperation;
    fallbackApplied: boolean;
    mysqlAvailable: boolean | null;
    allowWrite: boolean;
    reason?: string | undefined;
}
