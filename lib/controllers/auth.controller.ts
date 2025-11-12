import { Request, Response } from 'express';
import { config, SPOTIFY_ACCOUNTS_BASE_URL } from '../config/config';
import { SpotifyService } from '../services/spotify.service';

export class AuthController {
  /**
   * Initiate Spotify OAuth flow
   */
  static login(req: Request, res: Response) {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read',
    ].join(' ');

    // Build dynamic redirect URI based on current host
    // This allows OAuth to work in production, preview, and local environments
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${baseUrl}/api/auth/callback`;

    console.log('[AUTH LOGIN] Initiating OAuth with redirect_uri:', redirectUri);

    const authUrl = new URL(`${SPOTIFY_ACCOUNTS_BASE_URL}/authorize`);
    authUrl.searchParams.append('client_id', config.spotify.clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('show_dialog', 'true');

    res.json({ authUrl: authUrl.toString() });
  }

  /**
   * Handle OAuth callback from Spotify
   */
  static async callback(req: Request, res: Response) {
    console.log('[AUTH CALLBACK] Request received:', {
      path: req.path,
      originalUrl: req.originalUrl,
      query: req.query,
      method: req.method,
    });

    const { code, error } = req.query;

    // Get base URL from request for unified deployment
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${baseUrl}/api/auth/callback`;

    if (error) {
      return res.redirect(`${baseUrl}/?error=${error}`);
    }

    if (!code || typeof code !== 'string') {
      return res.redirect(`${baseUrl}/?error=no_code`);
    }

    try {
      // Exchange code for tokens (must use same redirect_uri as login)
      const tokens = await SpotifyService.getTokens(code, redirectUri);

      // Save tokens in session
      req.session.accessToken = tokens.access_token;
      req.session.refreshToken = tokens.refresh_token;
      req.session.tokenExpiry = Date.now() + tokens.expires_in * 1000;

      // Get user profile
      const spotifyService = new SpotifyService(tokens.access_token);
      const user = await spotifyService.getCurrentUser();
      req.session.user = user;

      console.log('[AUTH CALLBACK] Successfully authenticated user:', user.id);
      console.log('[AUTH CALLBACK] Session ID:', req.sessionID);
      console.log('[AUTH CALLBACK] Session saved:', {
        hasToken: !!req.session.accessToken,
        hasRefresh: !!req.session.refreshToken,
        userId: req.session.user?.id,
      });

      // Save session explicitly before redirecting
      req.session.save((err) => {
        if (err) {
          console.error('[AUTH CALLBACK] Session save error:', err);
        } else {
          console.log('[AUTH CALLBACK] Session saved successfully');
        }
        // Redirect to dashboard (same domain in unified deployment)
        res.redirect(`${baseUrl}/dashboard`);
      });
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      res.redirect(`${baseUrl}/?error=auth_failed`);
    }
  }

  /**
   * Logout user
   */
  static logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  }

  /**
   * Get current user session info
   */
  static getCurrentSession(req: Request, res: Response) {
    console.log('[SESSION CHECK] Session ID:', req.sessionID);
    console.log('[SESSION CHECK] Has access token:', !!req.session.accessToken);
    console.log('[SESSION CHECK] Session data:', {
      hasToken: !!req.session.accessToken,
      hasUser: !!req.session.user,
      userId: req.session.user?.id,
    });

    if (!req.session.accessToken) {
      console.log('[SESSION CHECK] No access token found - unauthenticated');
      return res.status(401).json({ authenticated: false });
    }

    console.log('[SESSION CHECK] Session valid - authenticated');
    res.json({
      authenticated: true,
      user: req.session.user,
    });
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response) {
    if (!req.session.refreshToken) {
      return res.status(401).json({ error: 'No refresh token available' });
    }

    try {
      const tokens = await SpotifyService.refreshAccessToken(req.session.refreshToken);

      req.session.accessToken = tokens.access_token;
      req.session.tokenExpiry = Date.now() + tokens.expires_in * 1000;

      res.json({ message: 'Token refreshed successfully' });
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(500).json({ error: 'Failed to refresh token' });
    }
  }

  /**
   * Debug endpoint to verify session configuration
   */
  static debugSession(req: Request, res: Response) {
    const sessionInfo = {
      sessionId: req.sessionID,
      hasSession: !!req.session,
      hasAccessToken: !!req.session?.accessToken,
      hasRefreshToken: !!req.session?.refreshToken,
      hasUser: !!req.session?.user,
      userId: req.session?.user?.id,
      cookieName: 'spotify.sid',
      cookies: req.headers.cookie,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV,
        hasKvUrl: !!process.env.KV_REST_API_URL,
        hasKvToken: !!process.env.KV_REST_API_TOKEN,
      },
    };

    console.log('[SESSION DEBUG]', sessionInfo);
    res.json(sessionInfo);
  }
}
