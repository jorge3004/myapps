const pool = require('../../db');

// Obtener datos de un usuario por ID (solo admin)
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute(
            'SELECT id, username, role, status, created_at, language, last_route, created_by_admin FROM users WHERE id = ? LIMIT 1',
            [id]
        );
        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: rows[0] });
    } catch (err) {
        console.error('Get user by ID error:', err);
        res.status(500).json({ success: false, message: 'Failed to get user information' });
    }
};
