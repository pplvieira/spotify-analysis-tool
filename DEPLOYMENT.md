# Deployment Guide

This guide covers deploying the Spotify Analysis Tool to production with preview and production environments.

## Deployment Strategy

Due to the session-based authentication, we recommend:
- **Frontend**: Deploy to Vercel (with preview & production environments)
- **Backend**: Deploy to Railway, Render, or Heroku (supports persistent sessions)

**Alternative**: Deploy backend to Vercel (requires session store setup - see below)

---

## Option 1: Frontend on Vercel + Backend on Railway (Recommended)

### Prerequisites
- GitHub account with this repository
- Vercel account (https://vercel.com)
- Railway account (https://railway.app)
- Spotify Developer App configured

### Part A: Deploy Backend to Railway

#### 1. Create Railway Project
```bash
# Install Railway CLI (optional)
npm install -g @railway/cli

# Or use Railway website
```

#### 2. Deploy via Railway Dashboard

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `spotify-analysis-tool` repository
4. Choose the `backend` folder as the root directory
5. Railway will auto-detect Node.js

#### 3. Configure Environment Variables

In Railway dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=3001
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://your-backend-url.railway.app/api/auth/callback
SESSION_SECRET=your_random_secure_secret_key
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### 4. Set Build & Start Commands

```json
{
  "build": "npm run build",
  "start": "node dist/server.js"
}
```

#### 5. Deploy

- Railway will automatically deploy on push to your main/production branch
- Get your backend URL: `https://your-app.railway.app`

### Part B: Deploy Frontend to Vercel

#### 1. Install Vercel CLI (optional)

```bash
npm install -g vercel
```

#### 2. Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your `spotify-analysis-tool` repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3. Configure Environment Variables

Add environment variable in Vercel:

**Production:**
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

**Preview (for PRs):**
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

#### 4. Enable Preview Deployments

In Vercel project settings:
- Go to "Git" → Enable "Preview Deployments"
- Every PR will get a unique preview URL
- Production deploys happen on merge to main branch

#### 5. Update Spotify Redirect URIs

Go to Spotify Developer Dashboard and add:
- `https://your-backend-url.railway.app/api/auth/callback` (production)
- `https://your-backend-preview.railway.app/api/auth/callback` (if using Railway preview)

---

## Option 2: Full Deployment on Vercel (Alternative)

**⚠️ Note**: Vercel serverless functions are stateless. Session-based auth requires a session store.

### Setup Session Store with Vercel KV

#### 1. Install Dependencies

```bash
cd backend
npm install @vercel/kv connect-redis
```

#### 2. Update Session Configuration

Edit `backend/src/server.ts` and `backend/api/index.ts`:

```typescript
import { kv } from '@vercel/kv';
import RedisStore from 'connect-redis';

// Create Redis store
const redisStore = new RedisStore({
  client: kv as any,
  prefix: 'spotify-session:',
});

// Update session middleware
app.use(
  session({
    store: redisStore,
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
    },
  })
);
```

#### 3. Deploy Backend to Vercel

```bash
cd backend
vercel --prod
```

Or connect via Vercel Dashboard:
1. New Project → Import repository
2. Root Directory: `backend`
3. Add environment variables (same as Railway)

#### 4. Deploy Frontend to Vercel

Follow Part B steps from Option 1, but use Vercel backend URL:
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## Option 3: Deploy to Render

### Backend on Render

1. Go to https://render.com
2. New Web Service → Connect repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`
4. Add environment variables (same as Railway)

### Frontend on Vercel

Follow Part B from Option 1

---

## Environment Configuration Summary

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3001` |
| `SPOTIFY_CLIENT_ID` | From Spotify Dashboard | `abc123...` |
| `SPOTIFY_CLIENT_SECRET` | From Spotify Dashboard | `xyz789...` |
| `SPOTIFY_REDIRECT_URI` | OAuth callback URL | `https://api.yourdomain.com/api/auth/callback` |
| `SESSION_SECRET` | Random secure string | `your-random-secret` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://yourdomain.com` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.yourdomain.com/api` |

---

## Preview Environments

### Vercel Preview Deployments

Vercel automatically creates preview deployments for:
- Every pull request
- Every push to non-production branches

**Preview URL format**: `https://your-app-git-branch-name.vercel.app`

### Railway Preview Environments

Railway can create PR-based preview environments:
1. Go to project settings
2. Enable "PR Deploys"
3. Each PR gets a unique URL

**To use different backends for preview:**

In Vercel, set environment variables per environment:
- Production: `VITE_API_URL=https://api-prod.railway.app/api`
- Preview: `VITE_API_URL=https://api-preview.railway.app/api`

---

## Deployment Workflow

### Production Deployment

1. Merge PR to `main` branch
2. Frontend auto-deploys to Vercel production
3. Backend auto-deploys to Railway/Render production
4. Update Spotify redirect URIs if domains change

### Preview Deployment

1. Create a feature branch
2. Push code and create PR
3. Vercel creates preview URL automatically
4. Test with preview URL
5. Merge when ready

---

## Post-Deployment Checklist

- [ ] Update Spotify Developer Dashboard redirect URIs
- [ ] Test OAuth flow in production
- [ ] Verify CORS settings allow frontend domain
- [ ] Test session persistence
- [ ] Verify all environment variables are set
- [ ] Test all analysis features with real data
- [ ] Check error logging and monitoring
- [ ] Set up custom domain (optional)

---

## Custom Domains

### Vercel Custom Domain

1. Go to Vercel project settings
2. Domains → Add domain
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` in backend env vars
5. Update Spotify redirect URI

### Railway Custom Domain

1. Go to Railway project settings
2. Settings → Domains → Add custom domain
3. Configure DNS
4. Update `SPOTIFY_REDIRECT_URI` to use new domain

---

## Monitoring & Logs

### Vercel
- View logs in Vercel dashboard → Deployments → Logs
- Set up log drains for external monitoring

### Railway
- View logs in Railway dashboard → Deployments
- Real-time logs available in CLI: `railway logs`

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches exact frontend domain
- Check that credentials: true is set in CORS config

### Session Not Persisting
- Verify `SESSION_SECRET` is set
- Check cookie settings (secure, sameSite)
- If on Vercel, ensure session store is configured

### OAuth Callback Failed
- Verify `SPOTIFY_REDIRECT_URI` matches Spotify dashboard exactly
- Check that backend URL is accessible
- Ensure redirect URI includes `/api/auth/callback`

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

---

## Quick Deploy Commands

### Deploy Frontend to Vercel
```bash
cd frontend
vercel --prod
```

### Deploy Backend to Railway (CLI)
```bash
cd backend
railway login
railway link
railway up
```

---

## Security Recommendations

1. **Never commit** `.env` files
2. Use strong `SESSION_SECRET` (32+ characters)
3. Enable HTTPS in production (automatic on Vercel/Railway)
4. Set `secure: true` for cookies in production
5. Implement rate limiting (add `express-rate-limit`)
6. Monitor for suspicious activity
7. Rotate secrets regularly
8. Use environment-specific Spotify apps (dev vs prod)

---

## Cost Considerations

### Free Tiers

**Vercel Free:**
- 100 GB bandwidth/month
- Unlimited personal projects
- Automatic preview deployments

**Railway Free Trial:**
- $5 free credits/month
- Pay as you go after free tier

**Render Free:**
- 750 hours/month free
- Spins down after inactivity

### Recommendations
- Start with free tiers
- Monitor usage
- Upgrade as needed based on traffic

---

For additional help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
