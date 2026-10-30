import { AuthAppPayload, AuthUserPayload, ApiKeyContext } from '../auth/authPayloads';

declare global {
    namespace Express {
        interface Request {
            user?: AuthUserPayload;
            authApp?: AuthAppPayload;
            apiKey?: ApiKeyContext;
        }
    }
}

export {};
