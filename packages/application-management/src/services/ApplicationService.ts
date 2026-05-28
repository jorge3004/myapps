import { IApplicationRepository, Application, ApiKey } from '../adapters/IApplicationRepository';
import crypto from 'crypto';

export class ApplicationService {
    private repo: IApplicationRepository;

    constructor(repo: IApplicationRepository) {
        this.repo = repo;
    }

    // Revocar una API key
    async revokeApiKey(appId: string, apiKey: string, revokedBy?: string): Promise<Application> {
        const app = await this.repo.findById(appId);
        if (!app) throw new Error('Application not found');
        const idx = app.apiKeys.findIndex((k: ApiKey) => k.apiKey === apiKey);
        if (idx === -1) throw new Error('API key not found');
        const isAlreadyRevoked = !!app.apiKeys[idx].revoked;
        // Contar cuántas API keys activas quedarían si se revoca esta
        const activeKeys = app.apiKeys.filter((k, i) => !k.revoked && i !== idx).length;
        if (!isAlreadyRevoked && activeKeys === 0) {
            throw new Error('Cannot revoke the last API key of the application');
        }
        if (isAlreadyRevoked) throw new Error('API key already revoked');
        app.apiKeys[idx].revoked = true;
        app.apiKeys[idx].revokedAt = new Date();
        if (revokedBy) app.apiKeys[idx].revokedBy = revokedBy;
        return this.repo.update(appId, { apiKeys: app.apiKeys });
    }
    // Utilidad para normalizar las API keys en la respuesta
    static normalizeApiKeys(apiKeys: ApiKey[]): ApiKey[] {
        return apiKeys.map(k => {
            const normalized: any = {
                ...k,
                revoked: !!k.revoked
            };
            if (!k.revoked) {
                delete normalized.revokedAt;
                delete normalized.revokedBy;
            }
            return normalized;
        });
    }

    // Registrar una nueva app, validando unicidad y generando API key
    async register(app: Omit<Application, 'id' | 'apiKeys'>): Promise<Application> {
        const exists = await this.repo.findByName(app.name);
        if (exists) throw new Error('Application name already exists');
        const id = this.generateId();
        const apiKey = this.generateApiKey();
        const newApp: Application = {
            ...app,
            id,
            apiKeys: [{ apiKey, scopes: ['*'], createdAt: new Date() }]
        };
        return this.repo.create(newApp);
    }

    async getApplicationById(id: string): Promise<Application | null> {
        return this.repo.findById(id);
    }

    async getApplicationByName(name: string): Promise<Application | null> {
        return this.repo.findByName(name);
    }

    async listApplications(): Promise<Application[]> {
        // Para la implementación en memoria, simplemente retorna todas
        // En una real, podrías tener paginación
        // @ts-ignore
        return (this.repo as any).apps || [];
    }

    async addApiKey(appId: string, scopes: string[]): Promise<ApiKey> {
        const app = await this.repo.findById(appId);
        if (!app) throw new Error('Application not found');
        const newKey: ApiKey = { apiKey: this.generateApiKey(), scopes, createdAt: new Date() };
        app.apiKeys.push(newKey);
        await this.repo.update(appId, { apiKeys: app.apiKeys });
        return newKey;
    }

    async listApiKeys(appId: string): Promise<ApiKey[]> {
        const app = await this.repo.findById(appId);
        if (!app) throw new Error('Application not found');
        return app.apiKeys;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 10);
    }

    private generateApiKey(): string {
        // Genera un apiKey seguro de 40 caracteres hexadecimales
        return crypto.randomBytes(20).toString('hex');
    }
}
