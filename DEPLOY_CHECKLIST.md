# Deployment Checklist

Quick reference for deploying to production.

## Pre-Deployment

- [ ] Spotify Developer App created
- [ ] Spotify Client ID and Secret obtained
- [ ] Vercel account created
- [ ] Railway account created
- [ ] GitHub repository connected

## Backend Deployment (Railway)

- [ ] New Railway project created
- [ ] GitHub repo connected
- [ ] Root directory set to `/backend`
- [ ] Environment variables added:
  - [ ] `NODE_ENV=production`
  - [ ] `SPOTIFY_CLIENT_ID`
  - [ ] `SPOTIFY_CLIENT_SECRET`
  - [ ] `SPOTIFY_REDIRECT_URI` (Railway URL + /api/auth/callback)
  - [ ] `SESSION_SECRET` (32+ random characters)
  - [ ] `FRONTEND_URL` (will update after Vercel deploy)
- [ ] Backend deployed successfully
- [ ] Backend URL noted: `___________________________`

## Frontend Deployment (Vercel)

- [ ] New Vercel project created
- [ ] GitHub repo imported
- [ ] Root directory set to `/frontend`
- [ ] Framework preset: Vite
- [ ] Environment variable added:
  - [ ] `VITE_API_URL` (Railway URL + /api)
  - [ ] Set for both Production and Preview
- [ ] Frontend deployed successfully
- [ ] Frontend URL noted: `___________________________`

## Post-Deployment Configuration

- [ ] Update Railway `FRONTEND_URL` to Vercel URL
- [ ] Railway redeployed with updated URL
- [ ] Spotify Dashboard updated with redirect URI
- [ ] Production OAuth flow tested
- [ ] All analysis features tested

## Preview Environment Setup

- [ ] Vercel preview deployments enabled
- [ ] Preview environment variables configured
- [ ] Test PR created to verify preview deployment
- [ ] Preview deployment tested

## Optional Enhancements

- [ ] Custom domain configured (Vercel)
- [ ] Custom domain configured (Railway)
- [ ] Monitoring/logging set up
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Analytics added (Vercel Analytics)
- [ ] Rate limiting implemented
- [ ] CI/CD tests added

## URLs Reference

**Production:**
- Frontend: `___________________________`
- Backend: `___________________________`

**Preview:**
- Frontend: `___________________________`
- Backend: `___________________________`

**Spotify:**
- Developer Dashboard: https://developer.spotify.com/dashboard
- Your App: `___________________________`

## Environment Variables Quick Copy

### Railway (Backend)
```env
NODE_ENV=production
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=https://your-app.railway.app/api/auth/callback
SESSION_SECRET=
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel (Frontend)
```env
VITE_API_URL=https://your-app.railway.app/api
```

## Troubleshooting Checklist

If something doesn't work:

- [ ] Check Vercel deployment logs
- [ ] Check Railway deployment logs
- [ ] Verify all environment variables are set
- [ ] Confirm `FRONTEND_URL` matches exactly
- [ ] Verify `SPOTIFY_REDIRECT_URI` matches Spotify Dashboard
- [ ] Test OAuth flow in incognito/private window
- [ ] Check browser console for errors
- [ ] Verify CORS headers in network tab
- [ ] Confirm cookies are being set
- [ ] Test API endpoints directly

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Spotify API: https://developer.spotify.com/documentation

---

**Last Updated:** _______________
**Deployed By:** _______________
**Notes:** _______________
