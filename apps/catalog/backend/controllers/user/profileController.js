const pool = require('../../db');

// Obtener datos del usuario autenticado
exports.getMe = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        const [rows] = await pool.execute(
            'SELECT id, username, role, created_at, language, last_route FROM users WHERE id = ? LIMIT 1',
            [userId]
        );
        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get user information' });
    }
};

// Cambiar idioma
exports.updateLanguage = async (req, res) => {
    const { id } = req.params;
    const { language } = req.body;
    if (!['es', 'en'].includes(language)) {
        return res.status(400).json({ success: false, message: 'Invalid language' });
    }
    if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    try {
        await pool.execute('UPDATE users SET language = ? WHERE id = ?', [language, id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update language' });
    }
};
