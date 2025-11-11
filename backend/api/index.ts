import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { config } from '../src/config/config';
import { attachUserSession } from '../src/middleware/auth.middleware';

// Import routes
import authRoutes from '../src/routes/auth.routes';
import spotifyRoutes from '../src/routes/spotify.routes';
import analysisRoutes from '../src/routes/analysis.routes';

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: config.frontend.url,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
// NOTE: Vercel serverless has limitations with session-based auth
// Consider using a session store like @vercel/kv or switching to JWT
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    },
  })
);

// Attach user session middleware
app.use(attachUserSession);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/analysis', analysisRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Export the Express app for Vercel serverless
export default app;
