import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
    redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3001/api/auth/callback',
  },

  session: {
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
};

export const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
export const SPOTIFY_ACCOUNTS_BASE_URL = 'https://accounts.spotify.com';
