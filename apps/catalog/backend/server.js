require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;
if (!PORT) {
    throw new Error('Environment variable PORT is not defined. Please set PORT in your backend .env file.');
}

app.use(cors());
app.use(express.json());
// Rutas


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const catalogRoutes = require('./routes/catalogs');
const passwordResetRoutes = require('./routes/auth/passwordReset');
const developerRoutes = require('./routes/developer');

// Health check endpoint (public, no auth)
app.get('/api/health', (req, res) => {
    console.log('PING /api/health');
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/catalogs', catalogRoutes);
app.use('/api/developer', developerRoutes);

app.get('/', (req, res) => {
    res.send('Hello from Node.js Backend!!!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/api/health`);
});
