// backend/models/catalog.js
// Modelo de acceso a la tabla de catálogos PDF
const pool = require('../db');



exports.createCatalog = async ({ name, s3_key, uploaded_by }) => {
    const [result] = await pool.execute(
        'INSERT INTO catalogs (name, s3_key, uploaded_by) VALUES (?, ?, ?)',
        [name, s3_key, uploaded_by]
    );
    return result.insertId;
};

exports.updateThumbnailUrl = async (id, thumbnailUrl) => {
    await pool.execute(
        'UPDATE catalogs SET thumbnail_url = ? WHERE id = ?',
        [thumbnailUrl, id]
    );
};

exports.getCatalogById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM catalogs WHERE id = ?', [id]);
    return rows[0] || null;
};

exports.getAllCatalogs = async () => {
    const [rows] = await pool.execute('SELECT * FROM catalogs ORDER BY created_at DESC');
    return rows;
};

exports.deleteCatalog = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM catalogs WHERE id = ?', [id]);
    if (!rows.length) return null;
    await pool.execute('DELETE FROM catalogs WHERE id = ?', [id]);
    return rows[0];
};
