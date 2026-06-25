import test from 'node:test';
import assert from 'node:assert/strict';
import { requireAppAccess } from '../middleware/requireAppAccess';

function mockRes() {
    const res: any = {
        statusCode: 200,
        body: undefined,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        json(payload: any) {
            this.body = payload;
            return this;
        }
    };
    return res;
}

test('requireAppAccess allows global admin user', () => {
    const middleware = requireAppAccess({ source: 'params' });
    const req: any = {
        user: { role: 'admin', appId: '*', scopes: ['*'] },
        params: { appId: 'catalog' }
    };
    const res = mockRes();
    let called = false;

    middleware(req, res as any, () => {
        called = true;
    });

    assert.equal(called, true);
    assert.equal(res.statusCode, 200);
});

test('requireAppAccess allows user with target app in claims', () => {
    const middleware = requireAppAccess({ source: 'body' });
    const req: any = {
        user: { role: 'user', appIds: ['catalog'] },
        body: { appId: 'catalog' }
    };
    const res = mockRes();
    let called = false;

    middleware(req, res as any, () => {
        called = true;
    });

    assert.equal(called, true);
    assert.equal(res.statusCode, 200);
});

test('requireAppAccess returns 403 when user lacks access to target app', () => {
    const middleware = requireAppAccess({ source: 'params' });
    const req: any = {
        user: { role: 'user', appIds: ['catalog'] },
        params: { appId: 'billing' }
    };
    const res = mockRes();
    let called = false;

    middleware(req, res as any, () => {
        called = true;
    });

    assert.equal(called, false);
    assert.equal(res.statusCode, 403);
    assert.equal(res.body.error, "User does not have access to app 'billing'");
});

test('requireAppAccess returns 400 when appId is missing', () => {
    const middleware = requireAppAccess({ source: 'body' });
    const req: any = {
        user: { role: 'user', appIds: ['catalog'] },
        body: {}
    };
    const res = mockRes();
    let called = false;

    middleware(req, res as any, () => {
        called = true;
    });

    assert.equal(called, false);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.error, 'appId required');
});
