import { IApplicationRepository, Application } from './IApplicationRepository';

export class InMemoryApplicationRepository implements IApplicationRepository {
    private apps: Application[] = [];

    async findById(id: string): Promise<Application | null> {
        return this.apps.find(a => a.id === id) || null;
    }

    async findByName(name: string): Promise<Application | null> {
        return this.apps.find(a => a.name === name) || null;
    }

    async create(app: Application): Promise<Application> {
        this.apps.push(app);
        return app;
    }

    async update(id: string, app: Partial<Application>): Promise<Application> {
        const idx = this.apps.findIndex(a => a.id === id);
        if (idx === -1) throw new Error('Application not found');
        this.apps[idx] = { ...this.apps[idx], ...app };
        return this.apps[idx];
    }

    async delete(id: string): Promise<void> {
        this.apps = this.apps.filter(a => a.id !== id);
    }
}
