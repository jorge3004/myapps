// MySQL model for apps and api_keys
import pool from '../db';

export interface App {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
}

export interface ApiKey {
    id: string;
    appId: string;
    apiKey: string;
    scopes: string[];
    revoked?: boolean;
    revokedAt?: string | null;
    revokedBy?: string | null;
    createdAt?: string;
}

function mapAppRow(row: any): App {
    return {
        id: row.id,
        name: row.name,
        description: row.description || '',
        createdAt: row.created_at
    };
}

function mapApiKeyRow(row: any): ApiKey {
    let scopes: string[] = [];
    if (Array.isArray(row.scopes)) scopes = row.scopes;
    else if (typeof row.scopes === 'string') {
        try { scopes = JSON.parse(row.scopes); } catch { scopes = []; }
    }
    return {
        id: row.id,
        appId: row.app_id,
        apiKey: row.api_key,
        scopes,
        revoked: !!row.revoked,
        revokedAt: row.revoked_at || null,
        revokedBy: row.revoked_by || null,
        createdAt: row.created_at
    };
}

export async function createApp({ id, name, description }: App): Promise<App> {
    await pool.execute(
        `INSERT INTO apps (id, name, description) VALUES (?, ?, ?)`,
        [id, name, description || null]
    );
    return getAppById(id) as Promise<App>;
}

export async function getAppById(id: string): Promise<App | null> {
    const [rows]: any = await pool.execute('SELECT * FROM apps WHERE id = ?', [id]);
    return rows[0] ? mapAppRow(rows[0]) : null;
}

export async function listApps(): Promise<App[]> {
    const [rows]: any = await pool.execute('SELECT * FROM apps ORDER BY name');
    return (rows || []).map(mapAppRow);
}

export async function getApiKeysForApp(appId: string): Promise<ApiKey[]> {
    const [rows]: any = await pool.execute('SELECT * FROM api_keys WHERE app_id = ?', [appId]);
    return (rows || []).map(mapApiKeyRow);
}

export async function insertApiKey(apiKey: ApiKey): Promise<ApiKey> {
    await pool.execute(
        `INSERT INTO api_keys (id, app_id, api_key, scopes) VALUES (?, ?, ?, ?)`,
        [apiKey.id, apiKey.appId, apiKey.apiKey, JSON.stringify(apiKey.scopes || [])]
    );
    return apiKey;
}

export async function revokeApiKeyById(apiKey: string, revokedBy?: string): Promise<boolean> {
    const [result]: any = await pool.execute(
        `UPDATE api_keys SET revoked = 1, revoked_at = NOW(), revoked_by = ? WHERE api_key = ? AND revoked = 0`,
        [revokedBy || null, apiKey]
    );
    return result.affectedRows > 0;
}
