import test from 'node:test';
import assert from 'node:assert/strict';
import {
    ROLE_SCOPES,
    buildUserAuthorizationContext,
    canAccessApp,
    deriveScopes,
    hasRequiredScope,
    normalizeScopes
} from '../services/authorizationService';
import { User } from '../models/user';

const baseUser: User = {
    id: 'u1',
    username: 'alice',
    email: 'alice@example.com',
    passwordHash: 'hash',
    role: 'user',
    scopes: [],
    revokedScopes: []
};

test('ROLE_SCOPES baseline remains defined', () => {
    assert.deepEqual(ROLE_SCOPES.user, ['read:users', 'read:catalogs']);
    assert.deepEqual(ROLE_SCOPES.editor, ['read:users', 'write:catalogs']);
});

test('deriveScopes merges role scopes and direct scopes and removes revoked', () => {
    const user: User = {
        ...baseUser,
        scopes: ['catalog:write:catalogs', 'custom:read:users'],
        revokedScopes: ['catalog:write:catalogs']
    };

    const scopes = deriveScopes(user, { catalog: 'editor' }, ['catalog']);

    assert.equal(scopes.includes('catalog:read:users'), true);
    assert.equal(scopes.includes('catalog:write:catalogs'), false);
    assert.equal(scopes.includes('custom:read:users'), true);
});

test('buildUserAuthorizationContext resolves app access for non-admin user', () => {
    const context = buildUserAuthorizationContext(baseUser, [{ appId: 'catalog', role: 'editor' }]);

    assert.equal(context.isGlobalAdmin, false);
    assert.equal(canAccessApp(context, 'catalog'), true);
    assert.equal(canAccessApp(context, 'billing'), false);
});

test('buildUserAuthorizationContext grants global admin access', () => {
    const admin: User = { ...baseUser, role: 'admin' };
    const context = buildUserAuthorizationContext(admin, []);

    assert.equal(context.isGlobalAdmin, true);
    assert.equal(canAccessApp(context, 'catalog'), true);
});

test('hasRequiredScope supports exact and wildcard patterns', () => {
    const scopes = ['catalog:read:*', '*:write:users'];

    assert.equal(hasRequiredScope(scopes, { appId: 'catalog', action: 'read', resource: 'users' }), true);
    assert.equal(hasRequiredScope(scopes, { appId: 'catalog', action: 'write', resource: 'users' }), true);
    assert.equal(hasRequiredScope(scopes, { appId: 'catalog', action: 'delete', resource: 'users' }), false);
});

test('normalizeScopes sanitizes malformed payload values', () => {
    assert.deepEqual(normalizeScopes(['a:b:c', '', 1, null, 'x:y:z'] as unknown), ['a:b:c', 'x:y:z']);
    assert.deepEqual(normalizeScopes('not-array'), []);
});
