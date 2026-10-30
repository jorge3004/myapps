import { Request } from 'express';
import { ROLE_SCOPES } from '../../services/authorizationService';

// Lanza Error si falta; el catch del controlador lo convierte en 400 { error: '<name> required' }
export function requireParam(req: Request, name: string): string {
    const value = req.params[name];
    if (!value) throw new Error(`${name} required`);
    return value;
}

export function requireScopeString(body: unknown): string {
    const scope = (body as { scope?: unknown } | undefined)?.scope;
    if (!scope || typeof scope !== 'string') throw new Error('Scope required');
    return scope;
}

// Valida formato <appId>:<action>:<resource> y que <action>:<resource> exista en ROLE_SCOPES
export function validateScope(scope: string): void {
    const parts = scope.split(':');
    if (parts.length !== 3 || parts.some(p => !p.trim())) {
        throw new Error('Scope must be in format <appId>:<action>:<resource>');
    }
    const validActions = new Set<string>();
    (Object.values(ROLE_SCOPES) as string[][]).forEach(list => list.forEach(s => validActions.add(s)));
    if (!validActions.has(`${parts[1]}:${parts[2]}`)) {
        throw new Error('Scope action/resource not recognized');
    }
}
