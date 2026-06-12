import './config/env.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { getMongoUri, validateSecurityConfig } from './config/env.js';
import { seedDatabase } from './services/seedDatabase.js';
import {
  securityHeaders,
  mongoSanitizeMiddleware,
  generalLimiter,
} from './middleware/security.js';
import authRoutes from './routes/auth.js';
import requestRoutes from './routes/requests.js';
import analyticsRoutes from './routes/analytics.js';
import reportRoutes from './routes/reports.js';

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

if (!validateSecurityConfig()) {
  process.exit(1);
}

app.set('trust proxy', 1);

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(securityHeaders);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(generalLimiter);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(mongoSanitizeMiddleware);

app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const ext = path.extname(req.path).toLowerCase();
    const safeImageExts = new Set(['.jpeg', '.jpg', '.png', '.gif', '.webp']);
    if (safeImageExts.has(ext)) {
      res.setHeader('Content-Disposition', 'inline');
    } else {
      res.setHeader('Content-Disposition', 'attachment');
    }
    next();
  },
  express.static(path.join(process.cwd(), 'uploads'), {
    dotfiles: 'deny',
    index: false,
  })
);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Work4You API is running',
    database: mongoose?.connection?.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);

app.use((err, _req, res, _next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'Origin not allowed' });
  }
  console.error(err);
  res.status(500).json({
    success: false,
    message: isProduction ? 'Internal server error' : err.message || 'Internal server error',
  });
});

const mongoUri = getMongoUri();
if (!mongoUri) {
  process.exit(1);
}

connectDB(mongoUri)
  .then(() => seedDatabase())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Work4You API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
