/**
 * Express Application Setup
 *
 * This file configures and exports the Express application.
 * It's used by both the local server (src/server.ts) and
 * the Vercel serverless function (api/index.ts).
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { config } from './config/config';
import { sessionConfig } from './config/session';
import { attachUserSession } from './middleware/auth.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import spotifyRoutes from './routes/spotify.routes';
import analysisRoutes from './routes/analysis.routes';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app: Application = express();

  // Trust proxy - required for Vercel and other cloud platforms
  app.set('trust proxy', 1);

  // CORS configuration with dynamic origin support
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        config.frontend.url,
        'http://localhost:3000',
        'http://localhost:3001',
      ];

      // Allow Vercel preview deployments
      if (origin.includes('vercel.app')) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  };

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Session configuration with KV store support
  app.use(session(sessionConfig));

  // Attach user session middleware
  app.use(attachUserSession);

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      vercel: !!process.env.VERCEL,
    });
  });

  // Root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Spotify Analysis API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        auth: '/api/auth/*',
        spotify: '/api/spotify/*',
        analysis: '/api/analysis/*',
      },
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/spotify', spotifyRoutes);
  app.use('/api/analysis', analysisRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not found',
      path: req.path,
      method: req.method,
    });
  });

  // Global error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error:', {
      message: err.message,
      stack: config.nodeEnv === 'development' ? err.stack : undefined,
      path: req.path,
      method: req.method,
    });

    res.status(err.status || 500).json({
      error: config.nodeEnv === 'production'
        ? 'Internal server error'
        : err.message,
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
  });

  return app;
}

// Export configured app instance
export default createApp();
