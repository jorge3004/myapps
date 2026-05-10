exports.register = async (req, res) => {
    const { username, password, theme } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }
    try {
        // Check if username exists
        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE username = ? LIMIT 1',
            [username]
        );
        if (existing.length) {
            return res.status(409).json({ success: false, message: 'Username already exists' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert new user
        await pool.execute(
            'INSERT INTO users (username, password, role, theme) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, 'user', theme || 'light']
        );
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// Middleware to verify JWT token
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

// GET /api/me - Get current user info (protected)
exports.getMe = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, username, role, created_at, theme FROM users WHERE id = ? LIMIT 1',
            [req.user.id]
        );
        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: rows[0] });
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ success: false, message: 'Failed to get user information' });
    }
};
