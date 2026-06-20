import { randomUUID } from 'crypto';
import * as appModel from '../../models/app';
import { ApiKey } from '../../models/app';
import { AppWithApiKeys, IAppRepository } from '../appRepository';

export class MysqlAppRepository implements IAppRepository {
    async listApplications(): Promise<AppWithApiKeys[]> {
        const apps = await appModel.listApps();
        return Promise.all(
            apps.map(async (app) => ({
                ...app,
                apiKeys: await appModel.getApiKeysForApp(app.id)
            }))
        );
    }

    async getApplicationById(id: string): Promise<AppWithApiKeys | null> {
        const app = await appModel.getAppById(id);
        if (!app) return null;
        return { ...app, apiKeys: await appModel.getApiKeysForApp(id) };
    }

    async register({ name, description }: { name: string; description?: string }): Promise<AppWithApiKeys> {
        const id = randomUUID().replace(/-/g, '').slice(0, 16);
        const app = await appModel.createApp({ id, name, description });
        return { ...app, apiKeys: [] };
    }

    async addApiKey(appId: string, scopes: string[] = ['*']): Promise<ApiKey> {
        const id = randomUUID().replace(/-/g, '').slice(0, 16);
        const key = randomUUID().replace(/-/g, '');
        return appModel.insertApiKey({ id, appId, apiKey: key, scopes });
    }

    async revokeApiKey(appId: string, apiKey: string, revokedBy?: string): Promise<AppWithApiKeys | null> {
        await appModel.revokeApiKeyById(apiKey, revokedBy);
        return this.getApplicationById(appId);
    }
}
