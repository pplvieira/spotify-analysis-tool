import { Request, Response } from 'express';
import { SpotifyService } from '../services/spotify.service';

export class SpotifyController {
  /**
   * Get current user's profile
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const spotifyService = new SpotifyService(req.session.accessToken!);
      const user = await spotifyService.getCurrentUser();
      res.json(user);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to fetch profile',
        details: error.response?.data || error.message,
      });
    }
  }

  /**
   * Get user's playlists
   */
  static async getPlaylists(req: Request, res: Response) {
    try {
      const spotifyService = new SpotifyService(req.session.accessToken!);
      const playlists = await spotifyService.getUserPlaylists();
      res.json(playlists);
    } catch (error: any) {
      console.error('Error fetching playlists:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to fetch playlists',
        details: error.response?.data || error.message,
      });
    }
  }

  /**
   * Get tracks from a specific playlist
   */
  static async getPlaylistTracks(req: Request, res: Response) {
    const { playlistId } = req.params;

    try {
      const spotifyService = new SpotifyService(req.session.accessToken!);
      const tracks = await spotifyService.getPlaylistTracks(playlistId);
      res.json(tracks);
    } catch (error: any) {
      console.error('Error fetching playlist tracks:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to fetch playlist tracks',
        details: error.response?.data || error.message,
      });
    }
  }

  /**
   * Get user's liked/saved tracks
   */
  static async getLikedSongs(req: Request, res: Response) {
    try {
      const spotifyService = new SpotifyService(req.session.accessToken!);
      const tracks = await spotifyService.getSavedTracks();
      res.json(tracks);
    } catch (error: any) {
      console.error('Error fetching liked songs:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to fetch liked songs',
        details: error.response?.data || error.message,
      });
    }
  }

  /**
   * Get all playlists with their tracks
   */
  static async getAllPlaylistsWithTracks(req: Request, res: Response) {
    try {
      const spotifyService = new SpotifyService(req.session.accessToken!);
      const playlistsWithTracks = await spotifyService.getAllPlaylistsWithTracks();
      res.json(playlistsWithTracks);
    } catch (error: any) {
      console.error('Error fetching playlists with tracks:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to fetch playlists with tracks',
        details: error.response?.data || error.message,
      });
    }
  }

  /**
   * Get track by URL
   */
  static async getTrackByUrl(req: Request, res: Response) {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
      const spotifyService = new SpotifyService(req.session.accessToken!);
      const track = await spotifyService.getTrackByUrl(url);
      res.json(track);
    } catch (error: any) {
      console.error('Error fetching track by URL:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to fetch track',
        details: error.response?.data || error.message,
      });
    }
  }

  /**
   * Get playlist by URL
   */
  static async getPlaylistByUrl(req: Request, res: Response) {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
      const spotifyService = new SpotifyService(req.session.accessToken!);
      const playlist = await spotifyService.getPlaylistByUrl(url);
      res.json(playlist);
    } catch (error: any) {
      console.error('Error fetching playlist by URL:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to fetch playlist',
        details: error.response?.data || error.message,
      });
    }
  }
}
