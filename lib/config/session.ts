import session from 'express-session';
import { config } from './config';

// For Vercel deployment with KV store
let sessionStore: session.Store | undefined;

// Only use KV store in production on Vercel
if (config.nodeEnv === 'production' && process.env.VERCEL) {
  try {
    // Dynamic import for Vercel KV (only available in production)
    const { kv } = require('@vercel/kv');
    const RedisStore = require('connect-redis').default;

    sessionStore = new RedisStore({
      client: kv,
      prefix: 'spotify-session:',
      ttl: 86400, // 24 hours in seconds
    });

    console.log('✓ Using Vercel KV for session storage');
  } catch (error) {
    console.warn('⚠ Vercel KV not available, using memory store');
    console.warn('  Sessions will not persist across serverless invocations');
  }
}

export const sessionConfig: session.SessionOptions = {
  store: sessionStore,
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    domain: config.nodeEnv === 'production' ? undefined : undefined,
  },
  // For production without KV, provide warning
  name: 'spotify.sid',
};

// Add warning if using memory store in production
if (config.nodeEnv === 'production' && !sessionStore && process.env.VERCEL) {
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.warn('⚠️  WARNING: Using memory-based sessions in production');
  console.warn('   Sessions will NOT persist across serverless functions');
  console.warn('   Configure Vercel KV for persistent sessions');
  console.warn('   See: https://vercel.com/docs/storage/vercel-kv');
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
