
import { IApplicationRepository, Application, ApiKey } from '../adapters/IApplicationRepository';
import crypto from 'crypto';

export class ApplicationService {
    private repo: IApplicationRepository;

    constructor(repo: IApplicationRepository) {
        this.repo = repo;
    }

    // Registrar una nueva app, validando unicidad y generando API key
    async register(app: Omit<Application, 'id' | 'apiKeys'>): Promise<Application> {
        // Validar unicidad de nombre
        const exists = await this.repo.findByName(app.name);
        if (exists) throw new Error('Application name already exists');
        // Generar id y API key
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
        return this.repo.apps || [];
    }

    async addApiKey(appId: string, scopes: string[]): Promise<ApiKey> {
        const app = await this.repo.findById(appId);
        if (!app) throw new Error('Application not found');
        const newKey: ApiKey = { apiKey: this.generateApiKey(), scopes, createdAt: new Date() };
        app.apiKeys.push(newKey);
        await this.repo.update(appId, { apiKeys: app.apiKeys });
        return newKey;
    }

    async revokeApiKey(appId: string, apiKey: string): Promise<void> {
        const app = await this.repo.findById(appId);
        if (!app) throw new Error('Application not found');
        app.apiKeys = app.apiKeys.filter(k => k.apiKey !== apiKey);
        await this.repo.update(appId, { apiKeys: app.apiKeys });
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
