import { ApplicationService } from './services/ApplicationService';
import { InMemoryApplicationRepository } from './adapters/InMemoryApplicationRepository';

const appRepo = new InMemoryApplicationRepository();
export const applicationService = new ApplicationService(appRepo);

// App fija para pruebas (ratw3urj)
import { Application } from './adapters/IApplicationRepository';
const fixedApp: Application = {
    id: 'ratw3urj',
    name: 'MiAppe3',
    description: 'App de ejemplo para test',
    apiKeys: [
        {
            apiKey: '694264583c61884d40752be8814c1bf98c2918aa',
            scopes: ['*'],
            createdAt: new Date(),
            revoked: false
        }
    ]
};
appRepo.create(fixedApp);
// Así podrías exponer otros servicios o controladores
