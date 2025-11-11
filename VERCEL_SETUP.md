# Quick Vercel Setup Guide

Step-by-step guide to deploy your Spotify Analysis Tool to Vercel with preview and production environments.

## Prerequisites

- GitHub repository with your code
- Vercel account (sign up at https://vercel.com)
- Railway account (sign up at https://railway.app) - for backend
- Spotify Developer App

---

## Step 1: Deploy Backend to Railway

### 1.1 Sign Up / Login to Railway
Visit https://railway.app and sign in with GitHub

### 1.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"spotify-analysis-tool"** repository
4. Select **"backend"** as the service directory

### 1.3 Configure Service
Railway will auto-detect Node.js. Configure:

**Root Directory**: `/backend`

**Build Command**: (auto-detected)
```bash
npm install && npm run build
```

**Start Command**: (auto-detected)
```bash
node dist/server.js
```

### 1.4 Add Environment Variables
In Railway dashboard → Variables tab, add:

```env
NODE_ENV=production
SPOTIFY_CLIENT_ID=your_client_id_from_spotify_dashboard
SPOTIFY_CLIENT_SECRET=your_client_secret_from_spotify_dashboard
SPOTIFY_REDIRECT_URI=https://YOUR-RAILWAY-URL.railway.app/api/auth/callback
SESSION_SECRET=generate_a_random_32_character_string
FRONTEND_URL=https://YOUR-VERCEL-URL.vercel.app
```

**To generate a secure SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.5 Deploy
Click **"Deploy"** - Railway will build and deploy your backend

### 1.6 Get Your Backend URL
- Go to Settings → Domains
- Copy your Railway URL (e.g., `https://spotify-backend-production.up.railway.app`)
- Save this - you'll need it for Vercel setup

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Sign Up / Login to Vercel
Visit https://vercel.com and sign in with GitHub

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Find and **Import** your **"spotify-analysis-tool"** repository

### 2.3 Configure Project Settings

**Framework Preset**: Vite (auto-detected)

**Root Directory**: Click **"Edit"** and select `frontend`

**Build & Development Settings**:
- Build Command: `npm run build` (default)
- Output Directory: `dist` (default)
- Install Command: `npm install` (default)

### 2.4 Add Environment Variables

Click **"Environment Variables"** and add:

**For Production:**
- Variable: `VITE_API_URL`
- Value: `https://YOUR-RAILWAY-URL.railway.app/api`
- Environment: **Production**

**For Preview:**
- Variable: `VITE_API_URL`
- Value: `https://YOUR-RAILWAY-URL.railway.app/api`
- Environment: **Preview**

(You can also use a separate Railway preview environment if you set one up)

### 2.5 Deploy
Click **"Deploy"** - Vercel will build and deploy your frontend

### 2.6 Get Your Frontend URL
- Vercel will show your deployment URL (e.g., `https://spotify-analysis-tool.vercel.app`)
- Save this URL

---

## Step 3: Update Backend Environment Variables

Now that you have your Vercel URL, update Railway:

1. Go back to Railway → Your backend service
2. Go to **Variables** tab
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Railway will automatically redeploy

---

## Step 4: Configure Spotify Developer App

### 4.1 Update Redirect URIs
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Click **"Edit Settings"**
4. Under **Redirect URIs**, add:
   ```
   https://YOUR-RAILWAY-URL.railway.app/api/auth/callback
   ```
5. Click **"Add"** then **"Save"**

---

## Step 5: Enable Preview Deployments

### 5.1 Vercel Preview Setup (Automatic)
Vercel automatically creates preview deployments for:
- Every pull request
- Every push to non-production branches

Preview URLs format: `https://your-app-git-branch.vercel.app`

### 5.2 Configure Preview Environment (Optional)
If you want different backend for previews:

1. Create a separate Railway service for previews
2. In Vercel, set Preview environment variable:
   ```
   VITE_API_URL=https://your-preview-backend.railway.app/api
   ```

---

## Step 6: Test Your Deployment

### 6.1 Test Production
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click **"Login with Spotify"**
3. Authorize the app
4. You should be redirected to the dashboard
5. Test the analysis features

### 6.2 Test Preview (Create a PR)
1. Create a new branch:
   ```bash
   git checkout -b test-feature
   ```
2. Make a small change (e.g., update a text)
3. Push and create a pull request
4. Vercel will comment with preview URL
5. Test the preview deployment

---

## Step 7: Set Up Custom Domain (Optional)

### Frontend Domain (Vercel)
1. Go to Vercel → Project Settings → Domains
2. Click **"Add"**
3. Enter your domain (e.g., `myapp.com`)
4. Follow DNS configuration instructions
5. Update `FRONTEND_URL` in Railway after domain is active

### Backend Domain (Railway)
1. Go to Railway → Settings → Domains
2. Click **"Custom Domain"**
3. Enter your API domain (e.g., `api.myapp.com`)
4. Configure DNS as shown
5. Update `SPOTIFY_REDIRECT_URI` in:
   - Railway environment variables
   - Spotify Developer Dashboard

---

## Deployment Workflow

### Daily Workflow

**Making Changes:**
1. Create feature branch
2. Make changes
3. Push to GitHub
4. Vercel automatically creates preview
5. Test preview deployment
6. Create PR and get team review
7. Merge to main
8. Automatic production deployment

**Monitoring:**
- Vercel Dashboard: Monitor frontend deployments
- Railway Dashboard: Monitor backend logs and metrics

---

## Environment Variables Reference

### Backend (Railway)

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `NODE_ENV` | Set manually | `production` |
| `SPOTIFY_CLIENT_ID` | Spotify Dashboard | `abc123def456...` |
| `SPOTIFY_CLIENT_SECRET` | Spotify Dashboard | `xyz789uvw012...` |
| `SPOTIFY_REDIRECT_URI` | Your Railway URL | `https://myapp.railway.app/api/auth/callback` |
| `SESSION_SECRET` | Generate random | `64 char random string` |
| `FRONTEND_URL` | Your Vercel URL | `https://myapp.vercel.app` |

### Frontend (Vercel)

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `VITE_API_URL` | Your Railway URL + /api | `https://myapp.railway.app/api` |

---

## Troubleshooting

### "Not authenticated" error
- Check `FRONTEND_URL` in Railway matches Vercel URL exactly
- Verify CORS is configured correctly
- Check browser console for CORS errors

### OAuth redirect fails
- Verify `SPOTIFY_REDIRECT_URI` in Railway matches Spotify Dashboard
- Check Railway logs for errors
- Ensure Railway service is running

### Preview deployment uses wrong backend
- Check Preview environment variable in Vercel
- Make sure `VITE_API_URL` is set for Preview environment

### Session doesn't persist
- Verify `SESSION_SECRET` is set in Railway
- Check cookie settings in browser (should accept third-party cookies for cross-domain)
- Railway should have persistent storage (default)

---

## Quick Commands

### View Logs
```bash
# Vercel logs (requires CLI)
vercel logs your-deployment-url

# Railway logs (requires CLI)
railway logs
```

### Redeploy
```bash
# Vercel redeploy
vercel --prod

# Railway redeploy (push to trigger)
git push origin main
```

### Environment Variables
```bash
# Vercel env (requires CLI)
vercel env ls
vercel env add VARIABLE_NAME

# Railway env (requires CLI)
railway variables set VARIABLE_NAME=value
```

---

## Next Steps

- [ ] Set up monitoring and alerts
- [ ] Configure custom domain
- [ ] Add analytics (Vercel Analytics)
- [ ] Set up error tracking (Sentry)
- [ ] Configure backup strategies
- [ ] Add rate limiting to backend
- [ ] Set up CI/CD tests before deploy

---

## Support Resources

- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app
- **Spotify API**: https://developer.spotify.com/documentation

Your app is now live with automatic preview deployments! 🚀
