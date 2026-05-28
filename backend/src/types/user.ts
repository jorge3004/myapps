export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    appIds?: string[];
    rolesPorApp?: { [appId: string]: string };
}