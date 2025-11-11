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

    const authUrl = new URL(`${SPOTIFY_ACCOUNTS_BASE_URL}/authorize`);
    authUrl.searchParams.append('client_id', config.spotify.clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', config.spotify.redirectUri);
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('show_dialog', 'true');

    res.json({ authUrl: authUrl.toString() });
  }

  /**
   * Handle OAuth callback from Spotify
   */
  static async callback(req: Request, res: Response) {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`${config.frontend.url}?error=${error}`);
    }

    if (!code || typeof code !== 'string') {
      return res.redirect(`${config.frontend.url}?error=no_code`);
    }

    try {
      // Exchange code for tokens
      const tokens = await SpotifyService.getTokens(code);

      // Save tokens in session
      req.session.accessToken = tokens.access_token;
      req.session.refreshToken = tokens.refresh_token;
      req.session.tokenExpiry = Date.now() + tokens.expires_in * 1000;

      // Get user profile
      const spotifyService = new SpotifyService(tokens.access_token);
      const user = await spotifyService.getCurrentUser();
      req.session.user = user;

      // Redirect to frontend with success
      res.redirect(`${config.frontend.url}/dashboard`);
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      res.redirect(`${config.frontend.url}?error=auth_failed`);
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
    if (!req.session.accessToken) {
      return res.status(401).json({ authenticated: false });
    }

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
}
