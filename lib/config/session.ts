import session from 'express-session';
import { config } from './config';

// For Vercel deployment with KV store
let sessionStore: session.Store | undefined;

// Only use KV store if environment variables are configured
const hasKVConfig = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

if (hasKVConfig && process.env.VERCEL) {
  try {
    // Dynamic import for Vercel KV
    const { kv } = require('@vercel/kv');
    const RedisStore = require('connect-redis').default;

    sessionStore = new RedisStore({
      client: kv,
      prefix: 'spotify-session:',
      ttl: 86400, // 24 hours in seconds
    });

    console.log('✓ Using Vercel KV for session storage');
  } catch (error) {
    console.warn('⚠ Vercel KV initialization failed, using memory store');
    console.warn('  Error:', error);
    console.warn('  Sessions will not persist across serverless invocations');
  }
} else if (process.env.VERCEL) {
  console.log('ℹ Vercel KV not configured, using memory store for sessions');
  console.log('  Sessions will not persist across serverless invocations');
  console.log('  This is fine for preview deployments');
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

// Add warning if using memory store in production (not preview)
const isProduction = config.nodeEnv === 'production' && process.env.VERCEL_ENV === 'production';
if (isProduction && !sessionStore) {
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.warn('⚠️  WARNING: Using memory-based sessions in production');
  console.warn('   Sessions will NOT persist across serverless functions');
  console.warn('   Configure Vercel KV for persistent sessions');
  console.warn('   See: https://vercel.com/docs/storage/vercel-kv');
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
