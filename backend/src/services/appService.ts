// datasource-agnostic app service
import { App, ApiKey } from '../models/app';
import { getAppRepository, getDataSource } from '../repositories';

export async function listApplications(): Promise<(App & { apiKeys: ApiKey[] })[]> {
    return getAppRepository().listApplications();
}

export async function getApplicationById(id: string): Promise<(App & { apiKeys: ApiKey[] }) | null> {
    return getAppRepository().getApplicationById(id);
}

export async function register({ name, description }: { name: string; description?: string }): Promise<App & { apiKeys: ApiKey[] }> {
    return getAppRepository().register({ name, description });
}

export async function addApiKey(appId: string, scopes: string[] = ['*']): Promise<ApiKey> {
    return getAppRepository().addApiKey(appId, scopes);
}

export async function revokeApiKey(appId: string, apiKey: string, revokedBy?: string): Promise<(App & { apiKeys: ApiKey[] }) | null> {
    return getAppRepository().revokeApiKey(appId, apiKey, revokedBy);
}

export function getAppDataSource(): string {
    return getDataSource();
}
