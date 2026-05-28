// Interfaz para el adaptador de persistencia de usuarios
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(id: string, user: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
    findAll(): Promise<User[]>;
}

// Tipo base de usuario (puedes extenderlo según tus necesidades)
export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    // ...otros campos
}
