# Deploying Backend to Vercel

This guide explains how to deploy the Spotify Analysis backend as a serverless application on Vercel.

## Project Structure

The backend follows best practices for Node.js/TypeScript applications and Vercel serverless deployment:

```
backend/
├── api/
│   └── index.ts          # Vercel serverless entry point
├── src/
│   ├── app.ts            # Express app configuration (shared)
│   ├── server.ts         # Local development server
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── types/            # TypeScript types
├── vercel.json           # Vercel configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## How It Works

### Separation of Concerns

**`src/app.ts`** - Creates and configures the Express application
- Middleware setup (CORS, sessions, body parsing)
- Route registration
- Error handling
- Exported as a factory function (`createApp()`) and default instance

**`api/index.ts`** - Vercel serverless function entry point
- Imports the Express app from `src/app.ts`
- Exports it for Vercel to use
- Vercel automatically handles routing all requests to this function

**`src/server.ts`** - Local development server
- Uses `createApp()` to create the Express instance
- Starts a Node.js HTTP server
- Only used in local development (`npm run dev`)

### Deployment Flow

1. **You push code to GitHub**
2. **Vercel detects changes** and triggers build
3. **Vercel installs dependencies** from `package.json`
4. **Vercel compiles TypeScript** automatically (no pre-build needed)
5. **Vercel creates serverless function** from `api/index.ts`
6. **All requests** are routed through `vercel.json` rewrites to `/api`
7. **Express handles routing** internally via `src/routes/*`

## Deployment Steps

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to** https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. **Import** your `spotify-analysis-tool` repository
4. **Configure project:**
   - Name: `spotify-analysis-backend`
   - Framework Preset: **Other**
   - Root Directory: Click **Edit** → Select `backend`
   - Build Command: Leave empty (Vercel auto-detects)
   - Output Directory: Leave empty
   - Install Command: `npm install`

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REDIRECT_URI=https://your-backend.vercel.app/api/auth/callback
   SESSION_SECRET=your_32_character_random_string
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. Click **"Deploy"**

7. **After deployment:**
   - Copy your backend URL
   - Update `SPOTIFY_REDIRECT_URI` with actual URL
   - Update Spotify Developer Dashboard redirect URIs
   - Redeploy if needed

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to backend directory
cd backend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to configure
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `SPOTIFY_CLIENT_ID` | From Spotify Dashboard | `abc123...` |
| `SPOTIFY_CLIENT_SECRET` | From Spotify Dashboard | `xyz789...` |
| `SPOTIFY_REDIRECT_URI` | OAuth callback URL | `https://api.yourdomain.com/api/auth/callback` |
| `SESSION_SECRET` | Random 32+ char string | Use: `openssl rand -hex 32` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://yourdomain.com` |

### Optional Variables for KV

If using Vercel KV for session storage:

| Variable | Description | Set By |
|----------|-------------|--------|
| `KV_REST_API_URL` | KV instance URL | Vercel (automatic) |
| `KV_REST_API_TOKEN` | KV auth token | Vercel (automatic) |
| `KV_REST_API_READ_ONLY_TOKEN` | KV read token | Vercel (automatic) |

See [VERCEL_KV_SETUP.md](../VERCEL_KV_SETUP.md) for KV setup instructions.

## Configuration Files

### vercel.json

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

**What it does:**
- Routes ALL requests to the `/api` serverless function
- Vercel looks for `api/index.ts` (or `api/index.js`)
- Express app handles internal routing

### tsconfig.json

Key configurations for Vercel:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",      // Required for Node.js
    "rootDir": ".",             // Include both src/ and api/
    "outDir": "./dist",
    "esModuleInterop": true
  },
  "include": ["src/**/*", "api/**/*"],  // Include api directory!
  "exclude": ["node_modules", "dist"]
}
```

**Important:** `include` MUST include `api/**/*` for Vercel to compile the entry point.

## Vercel Runtime Behavior

### What Vercel Does Automatically

✅ Detects TypeScript and compiles it
✅ Installs npm dependencies
✅ Creates serverless function from `api/` directory
✅ Sets up HTTPS
✅ Provides environment variables
✅ Handles zero-downtime deployments

### What You Need to Configure

⚙️ Environment variables (see above)
⚙️ Vercel KV for session persistence (optional but recommended)
⚙️ Custom domain (optional)

## Best Practices Implemented

### 1. **Separation of Concerns**
- App configuration (`src/app.ts`) separate from entry points
- Reusable app factory pattern
- Single source of truth for Express configuration

### 2. **Module Organization**
```
src/
├── config/       # Configuration and environment
├── controllers/  # Request handlers
├── middleware/   # Custom middleware
├── routes/       # Route definitions
├── services/     # Business logic
└── types/        # TypeScript types
```

### 3. **Type Safety**
- Strict TypeScript configuration
- Explicit types for all functions
- No implicit `any` types

### 4. **Error Handling**
- Global error handler
- Environment-aware error messages
- Proper HTTP status codes
- Logging for debugging

### 5. **Security**
- CORS configuration with dynamic origins
- Secure session management
- HttpOnly cookies
- Environment-based security settings
- Trust proxy for Vercel infrastructure

## Testing Deployment

### Health Check

After deployment, test these endpoints:

```bash
# Health check
curl https://your-backend.vercel.app/health

# Should return:
# {
#   "status": "ok",
#   "timestamp": "2025-01-15T12:00:00.000Z",
#   "environment": "production",
#   "vercel": true
# }
```

### API Documentation

```bash
# Root endpoint
curl https://your-backend.vercel.app/

# Should return API documentation
```

### OAuth Flow

1. Visit frontend
2. Click "Login with Spotify"
3. Should redirect to backend OAuth endpoint
4. Should redirect back to frontend after auth

## Troubleshooting

### 404: NOT_FOUND Error

**Causes:**
1. ❌ `api/index.ts` not found by Vercel
2. ❌ TypeScript compilation failed
3. ❌ Wrong root directory configured

**Solutions:**
1. ✅ Ensure root directory is set to `backend`
2. ✅ Check `tsconfig.json` includes `api/**/*`
3. ✅ Verify `api/index.ts` exists
4. ✅ Check Vercel build logs for errors

### Module Resolution Errors

**Error:** `Cannot find module '../src/app'`

**Solution:**
- Ensure `tsconfig.json` has `rootDir: "."`
- Check `include` array includes both `src` and `api`
- Verify relative import paths are correct

### Session Not Persisting

**Problem:** Users logged out on every request

**Cause:** Serverless functions are stateless

**Solutions:**
1. ✅ Set up Vercel KV (recommended)
2. ✅ Or deploy to Railway instead (persistent sessions built-in)

See [VERCEL_KV_SETUP.md](../VERCEL_KV_SETUP.md)

### CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solutions:**
1. ✅ Check `FRONTEND_URL` matches exactly
2. ✅ Ensure `credentials: true` in CORS config
3. ✅ Verify frontend uses `withCredentials: true`
4. ✅ Check that origin is allowed in `src/app.ts`

### Build Failures

Check Vercel deployment logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click on failed deployment
4. View **Build Logs**

Common issues:
- Missing dependencies in `package.json`
- TypeScript errors
- Environment variables not set

## Monitoring

### Vercel Dashboard

- **Deployments:** See all deployments and their status
- **Logs:** View runtime logs
- **Analytics:** Request counts and performance
- **Functions:** Monitor serverless function execution

### Logs

```bash
# View logs via CLI
vercel logs your-deployment-url

# Or in dashboard:
# Project → Deployment → Functions → View Logs
```

## Updating Deployment

### Automatic Deployments

- **Push to main branch** → Production deployment
- **Push to other branch** → Preview deployment
- **Create PR** → Preview deployment with comment

### Manual Redeploy

Via dashboard:
1. Go to Deployments
2. Find deployment
3. Click "..." menu
4. Select "Redeploy"

Via CLI:
```bash
cd backend
vercel --prod
```

## Performance

### Cold Starts

- **First request:** ~500-800ms (cold start)
- **Subsequent requests:** ~50-200ms (warm)
- **Optimization:** Use Vercel Pro for faster cold starts

### Scalability

- ✅ Automatic scaling
- ✅ No server management
- ✅ Pay per execution
- ✅ Global edge network

## Cost Estimation

### Hobby Plan (Free)

- 100 GB-hours of serverless function execution
- 100 GB bandwidth
- Unlimited personal projects

**Typical usage for this app:**
- ~1000-5000 requests/day = **Free**
- ~100-500 unique users/day = **Free**

### Pro Plan ($20/month)

- Faster cold starts
- More execution time
- Priority support

## Alternative: Railway

If you prefer persistent sessions without KV setup:

✅ Deploy backend to **Railway**
✅ Deploy frontend to **Vercel**
✅ See [VERCEL_SETUP.md](../VERCEL_SETUP.md)

## Summary

The backend is configured to follow industry best practices:

✅ **Modular Architecture** - Clear separation of concerns
✅ **Type Safety** - Full TypeScript coverage
✅ **Scalable** - Serverless auto-scaling
✅ **Secure** - Production-ready security settings
✅ **Maintainable** - Well-organized code structure
✅ **Documented** - Comprehensive inline documentation

**Deploy with confidence!** 🚀

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Project Issues: Create an issue in your repository
