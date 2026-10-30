// Formas reales de los payloads JWT, según se firman en authRoutes.ts y authTokenController.ts
import { RegisteredUser } from '../repositories/userRepository';

export interface AuthUserPayload extends Pick<RegisteredUser, 'role' | 'appIds' | 'rolesPorApp'> {
    type: 'user';
    userId: string;
    username: string;
    appId: string;
    scopes: string[];
}

export interface AuthAppPayload {
    type: 'app';
    appId: string;
    appName: string;
    scopes: string[];
}

export interface ApiKeyContext {
    scopes: string[];
}
