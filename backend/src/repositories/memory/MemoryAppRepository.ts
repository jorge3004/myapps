import { randomUUID } from 'crypto';
import { ApiKey } from '../../models/app';
import { AppWithApiKeys, IAppRepository } from '../appRepository';

const apps = new Map<string, AppWithApiKeys>();

function cloneApiKey(key: ApiKey): ApiKey {
    return {
        ...key,
        scopes: [...(key.scopes || [])]
    };
}

function cloneApp(app: AppWithApiKeys): AppWithApiKeys {
    return {
        ...app,
        apiKeys: (app.apiKeys || []).map(cloneApiKey)
    };
}

export class MemoryAppRepository implements IAppRepository {
    async listApplications(): Promise<AppWithApiKeys[]> {
        return Array.from(apps.values()).map(cloneApp);
    }

    async getApplicationById(id: string): Promise<AppWithApiKeys | null> {
        const app = apps.get(id);
        return app ? cloneApp(app) : null;
    }

    async register({ name, description }: { name: string; description?: string }): Promise<AppWithApiKeys> {
        const id = randomUUID().replace(/-/g, '').slice(0, 16);
        const app: AppWithApiKeys = {
            id,
            name,
            description: description || '',
            createdAt: new Date().toISOString(),
            apiKeys: []
        };
        apps.set(id, cloneApp(app));
        return cloneApp(app);
    }

    async addApiKey(appId: string, scopes: string[] = ['*']): Promise<ApiKey> {
        const app = apps.get(appId);
        if (!app) throw new Error('Application not found');

        const apiKey: ApiKey = {
            id: randomUUID().replace(/-/g, '').slice(0, 16),
            appId,
            apiKey: randomUUID().replace(/-/g, ''),
            scopes: [...(scopes || [])],
            revoked: false,
            revokedAt: null,
            revokedBy: null,
            createdAt: new Date().toISOString()
        };

        app.apiKeys = [...(app.apiKeys || []), cloneApiKey(apiKey)];
        apps.set(appId, cloneApp(app));
        return cloneApiKey(apiKey);
    }

    async revokeApiKey(appId: string, apiKey: string, revokedBy?: string): Promise<AppWithApiKeys | null> {
        const app = apps.get(appId);
        if (!app) return null;

        app.apiKeys = (app.apiKeys || []).map((item) => {
            if (item.apiKey !== apiKey) return item;
            return {
                ...item,
                revoked: true,
                revokedAt: new Date().toISOString(),
                revokedBy: revokedBy || null
            };
        });

        apps.set(appId, cloneApp(app));
        return cloneApp(app);
    }
}
