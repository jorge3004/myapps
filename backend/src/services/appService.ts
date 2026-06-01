// MySQL-backed app service
import * as appModel from '../models/app';
import { App, ApiKey } from '../models/app';
import { randomUUID } from 'crypto';

export const APP_DATA_SOURCE = 'mysql';

export async function listApplications(): Promise<(App & { apiKeys: ApiKey[] })[]> {
    const apps = await appModel.listApps();
    const result = await Promise.all(
        apps.map(async (app) => ({
            ...app,
            apiKeys: await appModel.getApiKeysForApp(app.id)
        }))
    );
    return result;
}

export async function getApplicationById(id: string): Promise<(App & { apiKeys: ApiKey[] }) | null> {
    const app = await appModel.getAppById(id);
    if (!app) return null;
    return { ...app, apiKeys: await appModel.getApiKeysForApp(id) };
}

export async function register({ name, description }: { name: string; description?: string }): Promise<App & { apiKeys: ApiKey[] }> {
    const id = randomUUID().replace(/-/g, '').slice(0, 16);
    const app = await appModel.createApp({ id, name, description });
    return { ...app, apiKeys: [] };
}

export async function addApiKey(appId: string, scopes: string[] = ['*']): Promise<ApiKey> {
    const id = randomUUID().replace(/-/g, '').slice(0, 16);
    const key = randomUUID().replace(/-/g, '');
    return appModel.insertApiKey({ id, appId, apiKey: key, scopes });
}

export async function revokeApiKey(appId: string, apiKey: string, revokedBy?: string): Promise<(App & { apiKeys: ApiKey[] }) | null> {
    await appModel.revokeApiKeyById(apiKey, revokedBy);
    return getApplicationById(appId);
}

export function getAppDataSource(): string {
    return APP_DATA_SOURCE;
}
