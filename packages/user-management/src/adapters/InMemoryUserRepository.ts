import { IUserRepository, User } from '../adapters/IUserRepository';

// Ejemplo de implementación en memoria para pruebas/desarrollo
export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];

    async findAll(): Promise<User[]> {
        return this.users;
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find(u => u.id === id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(u => u.email === email) || null;
    }

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async update(id: string, user: Partial<User>): Promise<User> {
        const idx = this.users.findIndex(u => u.id === id);
        if (idx === -1) throw new Error('User not found');
        this.users[idx] = { ...this.users[idx], ...user };
        return this.users[idx];
    }

    async delete(id: string): Promise<void> {
        this.users = this.users.filter(u => u.id !== id);
    }
}
