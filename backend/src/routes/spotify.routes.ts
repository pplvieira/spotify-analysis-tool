import { Router } from 'express';
import { SpotifyController } from '../controllers/spotify.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(requireAuth);

router.get('/profile', SpotifyController.getProfile);
router.get('/playlists', SpotifyController.getPlaylists);
router.get('/playlists/:playlistId/tracks', SpotifyController.getPlaylistTracks);
router.get('/liked-songs', SpotifyController.getLikedSongs);
router.get('/playlists-with-tracks', SpotifyController.getAllPlaylistsWithTracks);
router.get('/track', SpotifyController.getTrackByUrl);
router.get('/playlist', SpotifyController.getPlaylistByUrl);

export default router;
