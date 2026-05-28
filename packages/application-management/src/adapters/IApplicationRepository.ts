// Contrato para persistencia de aplicaciones
export interface IApplicationRepository {
    findById(id: string): Promise<Application | null>;
    findByName(name: string): Promise<Application | null>;
    create(app: Application): Promise<Application>;
    update(id: string, app: Partial<Application>): Promise<Application>;
    delete(id: string): Promise<void>;
}

// Estructura base de una aplicación
export interface Application {
    id: string;
    name: string;
    description: string;
    apiKeys: ApiKey[];
    // ...otros campos relevantes
}

// Estructura de una API Key
export interface ApiKey {
    apiKey: string;
    scopes: string[];
    createdAt: Date;
    revoked?: boolean;
    revokedAt?: Date;
    revokedBy?: string;
    // ...otros campos relevantes
}
