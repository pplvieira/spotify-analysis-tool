# Vercel Deployment Guide - Unified Application

This guide explains how to deploy the Spotify Analysis Tool as a single unified application on Vercel.

## Project Structure

```
/
├── api/                    # Serverless API entry point
│   └── index.ts           # Vercel function handler
├── lib/                    # Backend logic (Express app)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── app.ts             # Express application
├── src/                    # Frontend React application
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── types/
├── dist/                   # Build output (frontend + backend)
├── package.json            # Unified dependencies
├── tsconfig.json          # Frontend TypeScript config
├── tsconfig.server.json   # Backend TypeScript config
├── vite.config.ts         # Vite configuration
├── vercel.json            # Vercel configuration
└── index.html             # Frontend entry point
```

## Vercel Configuration

### 1. Import Project

1. Go to [vercel.com](https://vercel.com) and click "Add New" → "Project"
2. Import your Git repository: `pplvieira/spotify-analysis-tool`
3. Select branch: `claude/spotify-login-webapp-011CV1xXgmpmjZLnNi58LYQ5`

### 2. Project Settings

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Important**: Leave root directory as `./` (the project root), NOT a subdirectory.

### 3. Environment Variables

Add these environment variables in your Vercel project settings:

```bash
# Spotify OAuth Credentials (from https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Spotify Redirect URI (update after first deployment)
SPOTIFY_REDIRECT_URI=https://your-project-name.vercel.app/api/auth/callback

# Session Secret (generate a secure random string, 32+ characters)
SESSION_SECRET=your_long_random_secret_string_here

# Node Environment
NODE_ENV=production
```

## Post-Deployment Steps

### 1. Update Spotify App Settings

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your application
3. Click "Edit Settings"
4. Add your Vercel URL to "Redirect URIs":
   ```
   https://your-project-name.vercel.app/api/auth/callback
   ```
5. Save changes

### 2. Update Environment Variables

1. In your Vercel project, go to Settings → Environment Variables
2. Update `SPOTIFY_REDIRECT_URI` with your actual deployed URL:
   ```
   https://your-project-name.vercel.app/api/auth/callback
   ```
3. Redeploy to apply changes

## How It Works

### Unified Deployment Architecture

1. **Frontend**: React app built with Vite, served as static files from `/dist`
2. **Backend**: Express.js API running as Vercel Serverless Functions at `/api`
3. **Routing**:
   - All requests to `/api/*` → Backend serverless function
   - All other requests → Frontend static files

### API Communication

The frontend makes API calls using relative paths (`/api/...`), which are automatically routed to the serverless backend. No separate backend URL needed!

```typescript
// In src/services/api.ts
const API_BASE_URL = '/api';  // Relative path, works in production
```

### Session Management

Sessions are handled using:
- **Development**: In-memory session store
- **Production**: Vercel KV (optional but recommended)

To enable Vercel KV for persistent sessions:
1. Add Vercel KV to your project in the Vercel dashboard
2. The app will automatically detect and use it

## Testing the Deployment

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. You should see the login page
3. Click "Login with Spotify"
4. Authorize the app
5. You should be redirected to the dashboard

## Troubleshooting

### Issue: 404 on all routes
- **Solution**: Verify that root directory is set to `./` in Vercel settings

### Issue: API calls fail with CORS errors
- **Solution**: The unified deployment eliminates CORS issues since everything is on the same domain

### Issue: Sessions don't persist
- **Solution**: Add Vercel KV integration for session persistence

### Issue: Spotify redirect error
- **Solution**: Ensure `SPOTIFY_REDIRECT_URI` in Vercel exactly matches the URI in Spotify Dashboard

### Issue: Build fails
- **Solution**: Check that all environment variables are set correctly

## Local Development

For local development with the unified structure:

1. **Frontend Development**:
   ```bash
   npm run dev
   ```
   This runs Vite dev server on `http://localhost:5173`

2. **Backend Development** (separate terminal):
   ```bash
   cd backend
   npm run dev
   ```
   Set `VITE_API_URL=http://localhost:3001/api` in your `.env.local` file

## Deployment Checklist

- [ ] Repository imported to Vercel
- [ ] Root directory set to `./`
- [ ] All environment variables configured
- [ ] Spotify redirect URI added to Spotify Dashboard
- [ ] `SPOTIFY_REDIRECT_URI` updated with deployed URL
- [ ] Project successfully builds
- [ ] Login flow works end-to-end
- [ ] API calls succeed
- [ ] Analysis features work correctly

## Benefits of Unified Deployment

✅ **Simplified Configuration**: Single deployment, no CORS setup needed
✅ **Better Performance**: No cross-origin requests, faster API calls
✅ **Easier Maintenance**: One codebase, one deployment
✅ **Cost Effective**: Single Vercel project instead of two
✅ **Automatic HTTPS**: Both frontend and backend on same secure domain

## Next Steps

- Consider adding Vercel KV for session persistence
- Set up custom domain (optional)
- Enable Vercel Analytics (optional)
- Configure preview deployments for branches
