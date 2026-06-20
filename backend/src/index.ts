import './config/env';
import * as userRoutesImport from './routes/userRoutes';
const userRoutes = (userRoutesImport as any).default || userRoutesImport;
import express from 'express';
import authRoutes from './routes/authRoutes';
import catalogRoutes from './routes/catalogRoutes';
import appRoutes from './routes/appRoutes';
import authTokenRoutes from './routes/authTokenRoutes';
import auditRoutes from './routes/auditRoutes';
import { getUserDataSource } from './services/userService';
import { getAppDataSource } from './services/appService';
import { runtimeContextMiddleware } from './middleware/runtimeContext';
import { getRuntimeConfig, getRuntimeInfo } from './repositories';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(runtimeContextMiddleware);
app.use('/api/users', userRoutes);

// Registrar rutas bajo /api/auth


// Montar rutas de apps y catálogo
app.use('/api/apps', appRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', authTokenRoutes);
app.use('/api/audit-logs', auditRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health/data-source', (req, res) => {
  const runtime = getRuntimeInfo();
  res.json({
    status: 'ok',
    requestedEnvironment: runtime.requestedEnvironment,
    servedEnvironment: runtime.servedEnvironment,
    userDataSource: getUserDataSource(),
    appDataSource: getAppDataSource(),
    fallbackApplied: runtime.fallbackApplied,
    mysqlAvailable: runtime.mysqlAvailable,
    reason: runtime.reason || null
  });
});

app.get('/api/runtime/status', (req, res) => {
  const runtime = getRuntimeInfo();
  const config = getRuntimeConfig();
  res.json({
    status: 'ok',
    current: {
      requestedEnvironment: runtime.requestedEnvironment,
      servedEnvironment: runtime.servedEnvironment,
      requestedDataSource: runtime.requestedDataSource,
      servedDataSource: runtime.servedDataSource,
      fallbackApplied: runtime.fallbackApplied,
      mysqlAvailable: runtime.mysqlAvailable,
      operation: runtime.operation,
      reason: runtime.reason || null
    },
    defaults: {
      environment: config.defaultEnvironment,
      dataSource: config.defaultDataSource
    },
    available: {
      environments: config.allowedEnvironments,
      dataSources: config.allowedDataSources
    },
    policy: {
      fallbackReadToMemory: config.fallbackReadToMemory,
      readSemanticPostRoutes: config.readSemanticPostRoutes
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
