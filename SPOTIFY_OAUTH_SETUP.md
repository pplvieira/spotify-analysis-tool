# Spotify OAuth Setup Guide

## The "INVALID_CLIENT: Invalid redirect URI" Error

This error occurs when the redirect URI configured in your Spotify Developer Dashboard doesn't match what your app is using. Here's how to fix it:

## Step 1: Get Your Vercel Deployment URL

After deploying to Vercel, you'll get a URL like:
```
https://your-project-name.vercel.app
```

Copy this URL - you'll need it for the next steps.

## Step 2: Configure Spotify Developer Dashboard

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create app" (or select your existing app)
4. Fill in the details:
   - **App name**: Spotify Analysis Tool
   - **App description**: A tool to analyze Spotify playlists
   - **Redirect URIs**: **THIS IS CRITICAL** - Add your Vercel URL + callback path:
     ```
     https://your-project-name.vercel.app/api/auth/callback
     ```
   - **APIs used**: Select "Web API"
5. Click "Save"
6. On the app page, click "Settings"
7. Note your **Client ID** and **Client Secret**

## Step 3: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```bash
SPOTIFY_CLIENT_ID=your_client_id_from_spotify_dashboard
SPOTIFY_CLIENT_SECRET=your_client_secret_from_spotify_dashboard
SPOTIFY_REDIRECT_URI=https://your-project-name.vercel.app/api/auth/callback
SESSION_SECRET=create_a_random_32_character_string_here
NODE_ENV=production
```

**IMPORTANT**:
- The `SPOTIFY_REDIRECT_URI` must EXACTLY match what you entered in Spotify Dashboard
- Include the full URL with `https://`
- Don't forget `/api/auth/callback` at the end

## Step 4: Redeploy

After setting environment variables:
1. Go to **Deployments** in Vercel
2. Click the three dots on the latest deployment
3. Click **Redeploy**

## Step 5: Test the Login

1. Visit your Vercel URL
2. Click "Login with Spotify"
3. You'll be redirected to Spotify's authorization page
4. Log in with your Spotify account
5. Grant permissions
6. You'll be redirected back to your app's dashboard

## How OAuth Works (Why It Can't Be "Embedded")

Spotify uses OAuth 2.0 for security. This requires:

1. **User clicks "Login"** → App redirects to Spotify's login page
2. **User logs in on Spotify.com** → Secure authentication on Spotify's domain
3. **User grants permissions** → Spotify asks what data to share
4. **Spotify redirects back** → User returns to your app with authorization code
5. **Your app exchanges code for tokens** → Secure token exchange on backend
6. **User is logged in** → Your app can now access their Spotify data

**Why the redirect is required:**
- ✅ Security: User enters password only on Spotify.com, never in your app
- ✅ Trust: Users can verify they're on the real Spotify login page
- ✅ Privacy: Spotify controls what data is shared
- ✅ Standard: Industry-standard OAuth 2.0 protocol

You cannot embed Spotify's login because:
- Spotify doesn't allow their login form to be embedded (iframe blocking)
- OAuth requires the redirect flow for security
- This protects users from phishing attacks

## Common Issues

### Issue: Still getting "Invalid redirect URI"

**Solutions:**
1. Check that `SPOTIFY_REDIRECT_URI` in Vercel exactly matches Spotify Dashboard
2. Make sure there are no extra spaces or characters
3. Verify the protocol is `https://` (not `http://`)
4. Check the redirect URI in Spotify Dashboard includes `/api/auth/callback`
5. After changing environment variables, redeploy on Vercel

### Issue: "Application is in development mode"

This is normal for new Spotify apps. To make it public:
1. Go to Spotify Developer Dashboard
2. Select your app
3. Click "Users and Access"
4. Add users by email, or request quota extension for public access

### Issue: CSS not loading / UI looks broken

**Solution:**
- Clear your browser cache
- Do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors
- Verify the build completed successfully on Vercel

### Issue: Session not persisting

**Solution:**
- Add Vercel KV for session storage (optional but recommended for production)
- Ensure `SESSION_SECRET` is set in environment variables

## Testing Checklist

After configuration:
- [ ] Environment variables are set in Vercel
- [ ] Redirect URI matches exactly in both places
- [ ] App has been redeployed after setting env vars
- [ ] Login redirects to Spotify
- [ ] After login, redirects back to your app
- [ ] Dashboard loads with your Spotify data
- [ ] Can see playlists and liked songs
- [ ] Analysis features work

## Example: Complete Redirect URI

If your Vercel deployment is: `https://spotify-analyzer-123.vercel.app`

Then your redirect URI should be: `https://spotify-analyzer-123.vercel.app/api/auth/callback`

**Both in:**
- Spotify Developer Dashboard → App Settings → Redirect URIs
- Vercel → Settings → Environment Variables → SPOTIFY_REDIRECT_URI

## Security Notes

- Never commit your Client Secret to Git
- Use strong SESSION_SECRET (32+ random characters)
- Only use HTTPS in production (Vercel provides this automatically)
- Don't share your environment variables publicly
