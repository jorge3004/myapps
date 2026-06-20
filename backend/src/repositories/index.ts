import { IAppRepository } from './appRepository';
import { IUserRepository } from './userRepository';
import { MysqlUserRepository } from './mysql/MysqlUserRepository';
import { MysqlAppRepository } from './mysql/MysqlAppRepository';
import { MemoryUserRepository } from './memory/MemoryUserRepository';
import { MemoryAppRepository } from './memory/MemoryAppRepository';
import { getRuntimeContext } from '../runtime/requestContext';
import { DataSource } from '../runtime/types';
import { runtimeConfig } from '../runtime/config';

const mysqlUserRepository = new MysqlUserRepository();
const mysqlAppRepository = new MysqlAppRepository();
const memoryUserRepository = new MemoryUserRepository();
const memoryAppRepository = new MemoryAppRepository();

function getSourceRepositories(source: DataSource): { user: IUserRepository; app: IAppRepository } {
    if (source === 'memory') {
        return {
            user: memoryUserRepository,
            app: memoryAppRepository
        };
    }

    return {
        user: mysqlUserRepository,
        app: mysqlAppRepository
    };
}

export function getUserRepository(): IUserRepository {
    return getSourceRepositories(getRuntimeContext().servedDataSource).user;
}

export function getAppRepository(): IAppRepository {
    return getSourceRepositories(getRuntimeContext().servedDataSource).app;
}

export function getDataSource(): DataSource {
    return getRuntimeContext().servedDataSource;
}

export function getRuntimeInfo() {
    return getRuntimeContext();
}

export function getRuntimeConfig() {
    return runtimeConfig;
}
