import { ApplicationService } from './services/ApplicationService';
import { InMemoryApplicationRepository } from './adapters/InMemoryApplicationRepository';

const appRepo = new InMemoryApplicationRepository();
export const applicationService = new ApplicationService(appRepo);
// Así podrías exponer otros servicios o controladores
