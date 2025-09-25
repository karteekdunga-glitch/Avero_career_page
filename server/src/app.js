import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import requestLogger from './middleware/requestLogger.js';

import { connectDb } from './config/db.js';
import jobsRouter from './routes/jobs.js';
import applicationsRouter from './routes/applications.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CORS_ORIGIN || '*';

// ✅ DB
await connectDb();

// ✅ Middleware
app.use(helmet());
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(morgan('dev'));
app.use(requestLogger);

// ✅ Rate limit
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use('/api/', limiter);

// ✅ Routes
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/jobs', jobsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);

// ✅ Root route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is alive 🚀' });
});

// ✅ Errors
app.use(notFound);
app.use(errorHandler);

// ✅ Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Graceful shutdown
function shutdown(signal) {
  console.log(`Received ${signal}. Closing server...`);
  server.close((err) => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  setTimeout(() => process.exit(1), 100);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  setTimeout(() => process.exit(1), 100);
});
