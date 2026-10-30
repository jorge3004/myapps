import test from 'node:test';
import assert from 'node:assert/strict';
import { requireSelfOrScope } from '../middleware/requireSelfOrScope';
import { toPublicUser } from '../controllers/helpers/userResponse';

function mockRes() {
    const res: any = {
        statusCode: 200,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        json() {
            return this;
        }
    };
    return res;
}

const middleware = requireSelfOrScope({ param: 'userId', action: 'read', resource: 'users' });

test('requireSelfOrScope allows the owner', () => {
    const req: any = { params: { userId: 'u1' }, user: { userId: 'u1' }, apiKey: { scopes: [] } };
    let called = false;
    middleware(req, mockRes(), () => { called = true; });
    assert.equal(called, true);
});

test('requireSelfOrScope allows a user with read:users', () => {
    const req: any = { params: { userId: 'u2' }, user: { userId: 'u1' }, apiKey: { scopes: ['*:read:users'] } };
    let called = false;
    middleware(req, mockRes(), () => { called = true; });
    assert.equal(called, true);
});

test('requireSelfOrScope rejects another user without scope', () => {
    const req: any = { params: { userId: 'u2' }, user: { userId: 'u1' }, apiKey: { scopes: [] } };
    const res = mockRes();
    let called = false;
    middleware(req, res, () => { called = true; });
    assert.equal(called, false);
    assert.equal(res.statusCode, 403);
});

test('toPublicUser removes passwordHash', () => {
    const result = toPublicUser({ id: '1', username: 'a', passwordHash: 'secret' });
    assert.equal('passwordHash' in result, false);
    assert.equal(result.username, 'a');
});
