import * as userRoutesImport from './routes/userRoutes';
const userRoutes = (userRoutesImport as any).default || userRoutesImport;
import express from 'express';
import authRoutes from './routes/authRoutes';
import catalogRoutes from './routes/catalogRoutes';
import appRoutes from './routes/appRoutes';
import authTokenRoutes from './routes/authTokenRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/users', userRoutes);

// Registrar rutas bajo /api/auth


// Montar rutas de apps y catálogo
app.use('/api/apps', appRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', authTokenRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
