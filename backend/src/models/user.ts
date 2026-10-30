// Domain model: shape of a user record, independent of storage (MySQL/memory)
export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    role: string;
    scopes?: string[];
    revokedScopes?: string[];
}

