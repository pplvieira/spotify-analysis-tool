# Vercel KV Setup Guide (Optional but Recommended)

This guide explains how to set up Vercel KV (Redis) for persistent session storage when deploying the backend to Vercel.

## Why Use Vercel KV?

Vercel serverless functions are stateless. Without KV:
- ❌ Sessions don't persist between requests
- ❌ Users get logged out frequently
- ❌ OAuth flow may fail

With Vercel KV:
- ✅ Sessions persist reliably
- ✅ Users stay logged in
- ✅ OAuth works perfectly
- ✅ Free tier available (256MB storage)

## Quick Setup (5 minutes)

### Step 1: Create KV Database

1. Go to your Vercel dashboard
2. Select your backend project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **KV** (Redis)
6. Name it: `spotify-sessions`
7. Select region (closest to your users)
8. Click **Create**

### Step 2: Connect to Project

1. After creating, click **Connect to Project**
2. Select your backend project
3. Click **Connect**
4. Vercel will automatically add these environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### Step 3: Verify Setup

1. Redeploy your backend (automatic trigger)
2. Check deployment logs for:
   ```
   ✓ Using Vercel KV for session storage
   ```
3. If you see warnings about memory store, KV is not configured

### Step 4: Test

1. Visit your frontend
2. Login with Spotify
3. Refresh the page
4. You should stay logged in ✅

## Manual Environment Variable Setup

If automatic connection doesn't work:

1. Go to project **Settings** → **Environment Variables**
2. Add these from your KV dashboard:

```env
KV_REST_API_URL=https://your-kv-instance.kv.vercel-storage.com
KV_REST_API_TOKEN=your_token_here
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token_here
```

3. Redeploy for changes to take effect

## Verifying KV is Active

### Check Deployment Logs

Look for this message in your Vercel deployment logs:
```
✓ Using Vercel KV for session storage
```

### Test Session Persistence

1. Login to your app
2. Note your session cookie
3. Make an API request
4. Check if session data persists

### Check KV Dashboard

1. Go to Vercel Storage → Your KV database
2. Click **Data Browser**
3. You should see keys with prefix `spotify-session:`

## Code Implementation

The code automatically detects and uses KV when available:

**`backend/src/config/session.ts`**:
```typescript
// Automatically uses KV in production on Vercel
if (config.nodeEnv === 'production' && process.env.VERCEL) {
  const { kv } = require('@vercel/kv');
  const RedisStore = require('connect-redis').default;

  sessionStore = new RedisStore({
    client: kv,
    prefix: 'spotify-session:',
    ttl: 86400, // 24 hours
  });
}
```

No code changes needed - it works automatically once KV is set up!

## Pricing

**Free Tier:**
- 256 MB storage
- 10,000 commands/day
- 500 MB bandwidth/month

**Typical Usage:**
- Session size: ~1-2 KB
- Sessions stored: ~100,000
- Cost: **$0** (within free tier)

**Pro Tier** ($20/month if needed):
- 2 GB storage
- Unlimited commands
- 50 GB bandwidth

## Troubleshooting

### Sessions Still Not Persisting

1. **Check environment variables:**
   ```bash
   vercel env ls
   ```
   Should show `KV_REST_API_URL` and tokens

2. **Check deployment logs:**
   Look for warnings or errors about KV

3. **Verify KV database is created:**
   Check Vercel Storage tab

4. **Redeploy after adding KV:**
   ```bash
   vercel --prod
   ```

### "Cannot find module @vercel/kv" Error

This is expected in local development. KV only works in production. Locally, it uses memory storage.

### Sessions Work Locally but Not in Production

- Ensure KV is properly connected
- Check that environment variables are in **Production** scope
- Verify `trust proxy` is set in Express (already done in api/index.ts)

### KV Connection Errors

1. Check KV dashboard for downtime
2. Verify region is accessible
3. Check Vercel status page
4. Try recreating KV database

## Alternative: Railway Backend

If you prefer not to use KV, deploy backend to Railway instead:
- Railway supports persistent sessions natively
- No additional configuration needed
- See `VERCEL_SETUP.md` for Railway instructions

## Monitoring KV Usage

1. Go to Vercel Dashboard → Storage → Your KV
2. View **Metrics** tab:
   - Storage used
   - Commands per day
   - Request latency
   - Error rate

## Best Practices

1. **Set TTL appropriately:**
   - Current: 24 hours (86400 seconds)
   - Adjust in `backend/src/config/session.ts`

2. **Monitor storage:**
   - Keep an eye on usage in Vercel dashboard
   - Clean up old sessions automatically (TTL handles this)

3. **Use same region:**
   - Place KV in same region as your serverless functions
   - Reduces latency

4. **Secure your tokens:**
   - Never commit KV tokens to Git
   - Use Vercel's built-in environment variables

## Testing KV Locally

You can test KV locally with Vercel CLI:

```bash
# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run locally
npm run dev
```

Note: Local development will use memory store unless you configure local Redis.

## Summary

**With KV (Recommended for Vercel):**
```
✅ Persistent sessions
✅ Reliable OAuth
✅ Better user experience
✅ Free tier available
```

**Without KV:**
```
⚠️  Memory-based sessions
⚠️  Users may need to re-login frequently
⚠️  Works but not ideal for production
```

**Alternative:**
```
✅ Use Railway for backend (no KV needed)
✅ See VERCEL_SETUP.md for instructions
```

---

**Need Help?**
- Vercel KV Docs: https://vercel.com/docs/storage/vercel-kv
- Vercel Support: https://vercel.com/support
