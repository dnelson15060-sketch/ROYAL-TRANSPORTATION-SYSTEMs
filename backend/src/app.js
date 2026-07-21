const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const apiRouter = require('./routes/index');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Fallback origins used only when ALLOWED_ORIGINS is not configured, so the
// API never falls back to an unrestricted wildcard ("*") in any environment.
const DEFAULT_DEV_ORIGINS = ['http://localhost:3000', 'http://localhost:5173'];

/**
 * Builds and configures the Express application. Kept separate from
 * server startup (index.js) so tests can import the app directly with
 * supertest without binding to a real network port.
 */
function createApp() {
  const app = express();

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const originAllowList = allowedOrigins.length > 0 ? allowedOrigins : DEFAULT_DEV_ORIGINS;

  app.use(helmet());
  app.use(
    cors({
      // Explicitly validate against a known allow-list rather than
      // reflecting/echoing the request origin or using a wildcard, to
      // avoid overly permissive cross-origin access.
      origin(origin, callback) {
        // Allow non-browser requests (no Origin header, e.g. server-to-server
        // calls, curl, or same-origin requests) through.
        if (!origin || originAllowList.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Global rate limiting to protect authentication and authorization-sensitive
  // endpoints from brute-force / abuse.
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/v1', apiLimiter);

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
