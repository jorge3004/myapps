
import { IUserRepository, User } from '../adapters/IUserRepository';

export class UserService {
    private repo: IUserRepository;

    constructor(repo: IUserRepository) {
        this.repo = repo;
    }

    async listAllUsers(): Promise<User[]> {
        return this.repo.findAll();
    }
    async getUserByUsername(username: string): Promise<User | null> {
        // En este modelo, username es el campo name

        // Buscar todos los usuarios y filtrar por name
        if (!this.repo.findAll) throw new Error('findAll no implementado en el repositorio');
        const users = await this.repo.findAll();
        return users.find(u => u.name === username) || null;
    }

    async register(user: User): Promise<User> {
        // Aquí podrías agregar validaciones, hashing, etc.
        return this.repo.create(user);
    }

    async getUserById(id: string): Promise<User | null> {
        return this.repo.findById(id);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.repo.findByEmail(email);
    }

    // ...otros métodos de negocio
}
