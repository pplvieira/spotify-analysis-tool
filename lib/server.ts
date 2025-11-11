/**
 * Local Development Server
 *
 * This file starts a local Express server for development.
 * In production on Vercel, the api/index.ts file is used instead.
 */

import { createApp } from './app';
import { config } from './config/config';

// Create Express application
const app = createApp();

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🎵 Spotify Client ID: ${config.spotify.clientId ? '✓ Set' : '✗ Not set'}`);
});

export default app;
