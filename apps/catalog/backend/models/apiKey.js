const pool = require('../db');

// API Key model helpers
const ApiKey = {
  async create(user_id, api_key, scopes) {
    return pool.execute(
      'INSERT INTO api_keys (user_id, api_key, scopes) VALUES (?, ?, ?)',
      [user_id, api_key, JSON.stringify(scopes)]
    );
  },
  async findByKey(api_key) {
    const [rows] = await pool.execute(
      'SELECT * FROM api_keys WHERE api_key = ? AND revoked = 0 LIMIT 1',
      [api_key]
    );
    return rows[0];
  },
  async listByUser(user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM api_keys WHERE user_id = ?',
      [user_id]
    );
    return rows;
  },
  async revoke(api_key) {
    return pool.execute(
      'UPDATE api_keys SET revoked = 1, revoked_at = NOW() WHERE api_key = ?',
      [api_key]
    );
  }
};

module.exports = ApiKey;
