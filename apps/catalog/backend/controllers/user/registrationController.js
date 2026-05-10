const pool = require('../../db');
const bcrypt = require('bcryptjs');

// Crear usuario
exports.createUser = async (req, res) => {
    const { preferred_name, last_name, password, role = 'user', created_by_admin } = req.body;
    if (!preferred_name || !last_name) {
        return res.status(400).json({ success: false, message: 'Preferred name and last name are required' });
    }
    let finalPassword = password;
    let adminFlag = false;
    if (created_by_admin) {
        finalPassword = '123456';
        adminFlag = true;
    }
    if (!finalPassword || finalPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }
    // Generar username base: preferred_name + primera letra de last_name, todo minúsculas, sin espacios
    let baseUsername = (preferred_name.replace(/\s+/g, '') + last_name[0]).toLowerCase();
    let username = baseUsername;
    let suggested = null;
    try {
        // Si el cliente envía username, validar que sea la sugerencia correcta
        if (req.body.username) {
            // Calcular sugerencia para estos datos
            let counter = 1;
            let exists = true;
            let tempUsername = baseUsername;
            while (exists) {
                const [existing] = await pool.execute(
                    'SELECT id FROM users WHERE username = ? LIMIT 1',
                    [tempUsername]
                );
                if (!existing.length) {
                    exists = false;
                } else {
                    suggested = baseUsername + counter;
                    tempUsername = suggested;
                    counter++;
                }
            }
            // Solo aceptar si username enviado es igual a la sugerencia
            if (req.body.username !== suggested) {
                return res.status(400).json({ success: false, message: 'Invalid username for this name/lastname', expected: suggested });
            }
            username = suggested;
        } else {
            // Buscar si ya existe el username base o variantes con número
            let counter = 1;
            let exists = true;
            while (exists) {
                const [existing] = await pool.execute(
                    'SELECT id FROM users WHERE username = ? LIMIT 1',
                    [username]
                );
                if (!existing.length) {
                    exists = false;
                } else {
                    suggested = baseUsername + counter;
                    username = suggested;
                    counter++;
                }
            }
            // Si el username base no está disponible, sugerir el siguiente
            if (suggested) {
                return res.status(409).json({ success: false, message: 'Username already exists', suggested_username: suggested });
            }
        }
        const hashedPassword = await bcrypt.hash(finalPassword, 10);
        await pool.execute(
            'INSERT INTO users (username, preferred_name, last_name, password, role, created_by_admin) VALUES (?, ?, ?, ?, ?, ?)',
            [username, preferred_name, last_name, hashedPassword, role, adminFlag]
        );
        res.status(201).json({ success: true, message: 'User registered successfully', username, temp_password: adminFlag ? '123456' : undefined });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
