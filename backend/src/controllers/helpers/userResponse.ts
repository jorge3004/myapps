import { User } from '../../models/user';

export type PublicUser = Omit<User, 'passwordHash'>;

// Nunca exponer passwordHash en respuestas HTTP
export function toPublicUser<T extends { passwordHash?: unknown }>(user: T): Omit<T, 'passwordHash'> {
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
}
