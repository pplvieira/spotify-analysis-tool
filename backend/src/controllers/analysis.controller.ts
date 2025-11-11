import { Request, Response } from 'express';
import { SpotifyService } from '../services/spotify.service';
import { AnalysisService } from '../services/analysis.service';

export class AnalysisController {
  /**
   * Find songs that appear in multiple playlists
   */
  static async findSongsInMultiplePlaylists(req: Request, res: Response) {
    try {
      const minAppearances = parseInt(req.query.minAppearances as string) || 2;

      const spotifyService = new SpotifyService(req.session.accessToken!);
      const playlists = await spotifyService.getAllPlaylistsWithTracks();

      const songAppearances = AnalysisService.findSongsInMultiplePlaylists(
        playlists,
        minAppearances
      );

      res.json({
        totalPlaylists: playlists.length,
        songsFound: songAppearances.length,
        songs: songAppearances,
      });
    } catch (error: any) {
      console.error('Error analyzing song appearances:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to analyze song appearances',
        details: error.response?.data || error.message,
      });
    }
  }

  /**
   * Get library statistics
   */
  static async getLibraryStats(req: Request, res: Response) {
    try {
      const spotifyService = new SpotifyService(req.session.accessToken!);

      // Fetch data in parallel for better performance
      const [playlists, likedSongs] = await Promise.all([
        spotifyService.getAllPlaylistsWithTracks(),
        spotifyService.getSavedTracks(),
      ]);

      const stats = AnalysisService.getLibraryStats(playlists, likedSongs);

      res.json(stats);
    } catch (error: any) {
      console.error('Error getting library stats:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to get library statistics',
        details: error.response?.data || error.message,
      });
    }
  }

  /**
   * Find duplicate songs (songs appearing in more than one playlist)
   */
  static async findDuplicates(req: Request, res: Response) {
    try {
      const spotifyService = new SpotifyService(req.session.accessToken!);
      const playlists = await spotifyService.getAllPlaylistsWithTracks();

      const duplicates = AnalysisService.findDuplicateSongs(playlists);

      res.json({
        totalPlaylists: playlists.length,
        duplicatesFound: duplicates.length,
        duplicates,
      });
    } catch (error: any) {
      console.error('Error finding duplicates:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to find duplicates',
        details: error.response?.data || error.message,
      });
    }
  }

  /**
   * Get most common artists
   */
  static async getMostCommonArtists(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;

      const spotifyService = new SpotifyService(req.session.accessToken!);
      const playlists = await spotifyService.getAllPlaylistsWithTracks();

      const artists = AnalysisService.getMostCommonArtists(playlists, limit);

      res.json({
        totalPlaylists: playlists.length,
        artists,
      });
    } catch (error: any) {
      console.error('Error getting most common artists:', error);
      res.status(error.response?.status || 500).json({
        error: 'Failed to get most common artists',
        details: error.response?.data || error.message,
      });
    }
  }
}
