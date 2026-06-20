import { App, ApiKey } from '../models/app';

export interface AppWithApiKeys extends App {
    apiKeys: ApiKey[];
}

export interface IAppRepository {
    listApplications(): Promise<AppWithApiKeys[]>;
    getApplicationById(id: string): Promise<AppWithApiKeys | null>;
    register(payload: { name: string; description?: string }): Promise<AppWithApiKeys>;
    addApiKey(appId: string, scopes: string[]): Promise<ApiKey>;
    revokeApiKey(appId: string, apiKey: string, revokedBy?: string): Promise<AppWithApiKeys | null>;
}
