import { UserService } from './services/UserService';
import { InMemoryUserRepository } from './adapters/InMemoryUserRepository';

// Ejemplo de inicialización del módulo
const userRepo = new InMemoryUserRepository();
export const userService = new UserService(userRepo);

// Así podrías exponer otros servicios o controladores
