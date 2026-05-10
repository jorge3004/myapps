// Middleware para verificar si el usuario es admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Only administrators can perform this action' });
};
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('Environment variable JWT_SECRET is not defined. Please set JWT_SECRET in tu backend .env file.');
}

// --- LOGIN Y FLUJO DE PRIMER ACCESO ---
exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    try {
        const [rows] = await pool.execute(
            'SELECT id, username, password, role, created_at, language, status, last_route, theme, created_by_admin FROM users WHERE username = ? LIMIT 1',
            [username]
        );
        if (!rows.length) {
            return res.status(401).json({ success: false, message: 'User does not exist' });
        }
        const user = rows[0];
        if (user.status && user.status === 'inactive') {
            return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact an administrator.' });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }
        // Permitir login si status es pending SOLO si tiene created_by_admin y password temporal
        if (user.status && user.status === 'pending') {
            if (user.created_by_admin && password === '123456') {
                return res.json({ success: true, require_password_change: true, user: { id: user.id, username: user.username } });
            } else {
                return res.status(403).json({ success: false, message: 'Your account has not yet been approved by an administrator.' });
            }
        }
        // Login normal
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        const { password: _, ...userData } = user;
        res.json({ success: true, token, user: userData });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// --- CAMBIO DE CONTRASEÑA Y ACTIVACIÓN ---
exports.changePassword = async (req, res) => {
    const { id } = req.params;
    const { current, next } = req.body;
    if (!current || !next || next.length < 6) {
        return res.status(400).json({ success: false, message: 'Invalid data' });
    }
    if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    try {
        const [rows] = await pool.execute('SELECT password, status, created_by_admin FROM users WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const valid = await bcrypt.compare(current, rows[0].password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Current password incorrect' });
        }
        const hashed = await bcrypt.hash(next, 10);
        // Si el usuario tenía created_by_admin y status pending, activar y limpiar flag
        if (rows[0].status === 'pending' && rows[0].created_by_admin) {
            await pool.execute('UPDATE users SET password = ?, status = ?, created_by_admin = 0 WHERE id = ?', [hashed, 'active', id]);
        } else {
            await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, id]);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to change password' });
    }
};

// Middleware de autenticación
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
