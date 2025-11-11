import axios, { AxiosInstance } from 'axios';
import { config, SPOTIFY_API_BASE_URL, SPOTIFY_ACCOUNTS_BASE_URL } from '../config/config';
import {
  SpotifyTokens,
  SpotifyUser,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyPagingObject,
  SavedTrack,
  PlaylistTrack,
  PlaylistWithTracks,
} from '../types/spotify.types';

export class SpotifyService {
  private axiosInstance: AxiosInstance;

  constructor(accessToken: string) {
    this.axiosInstance = axios.create({
      baseURL: SPOTIFY_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Exchange authorization code for access tokens
   */
  static async getTokens(code: string, redirectUri: string): Promise<SpotifyTokens> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    });

    console.log('[SPOTIFY SERVICE] Exchanging code for tokens with redirect_uri:', redirectUri);

    const response = await axios.post<SpotifyTokens>(
      `${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${config.spotify.clientId}:${config.spotify.clientSecret}`
          ).toString('base64')}`,
        },
      }
    );

    return response.data;
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await axios.post<SpotifyTokens>(
      `${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${config.spotify.clientId}:${config.spotify.clientSecret}`
          ).toString('base64')}`,
        },
      }
    );

    return response.data;
  }

  /**
   * Get current user's profile
   */
  async getCurrentUser(): Promise<SpotifyUser> {
    const response = await this.axiosInstance.get<SpotifyUser>('/me');
    return response.data;
  }

  /**
   * Get all user's playlists (handles pagination)
   */
  async getUserPlaylists(): Promise<SpotifyPlaylist[]> {
    const playlists: SpotifyPlaylist[] = [];
    let url = '/me/playlists?limit=50';

    while (url) {
      const response = await this.axiosInstance.get<SpotifyPagingObject<SpotifyPlaylist>>(url);
      playlists.push(...response.data.items);

      // Handle pagination
      url = response.data.next ? response.data.next.replace(SPOTIFY_API_BASE_URL, '') : '';
    }

    return playlists;
  }

  /**
   * Get tracks from a specific playlist (handles pagination)
   */
  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    const tracks: SpotifyTrack[] = [];
    let url = `/playlists/${playlistId}/tracks?limit=100`;

    while (url) {
      const response = await this.axiosInstance.get<SpotifyPagingObject<PlaylistTrack>>(url);

      // Filter out null tracks (sometimes tracks are removed but remain in playlists)
      const validTracks = response.data.items
        .filter(item => item.track !== null)
        .map(item => item.track);

      tracks.push(...validTracks);

      // Handle pagination
      url = response.data.next ? response.data.next.replace(SPOTIFY_API_BASE_URL, '') : '';
    }

    return tracks;
  }

  /**
   * Get user's liked/saved tracks (handles pagination)
   */
  async getSavedTracks(): Promise<SpotifyTrack[]> {
    const tracks: SpotifyTrack[] = [];
    let url = '/me/tracks?limit=50';

    while (url) {
      const response = await this.axiosInstance.get<SpotifyPagingObject<SavedTrack>>(url);
      tracks.push(...response.data.items.map(item => item.track));

      // Handle pagination
      url = response.data.next ? response.data.next.replace(SPOTIFY_API_BASE_URL, '') : '';
    }

    return tracks;
  }

  /**
   * Get all playlists with their complete track data
   * This is memory-efficient as it processes one playlist at a time
   */
  async getAllPlaylistsWithTracks(): Promise<PlaylistWithTracks[]> {
    const playlists = await this.getUserPlaylists();
    const playlistsWithTracks: PlaylistWithTracks[] = [];

    // Process playlists sequentially to avoid rate limiting
    for (const playlist of playlists) {
      const tracks = await this.getPlaylistTracks(playlist.id);
      playlistsWithTracks.push({
        ...playlist,
        trackItems: tracks,
      });
    }

    return playlistsWithTracks;
  }

  /**
   * Get track details by URL (extracts ID from URL and fetches track)
   */
  async getTrackByUrl(url: string): Promise<SpotifyTrack> {
    // Extract track ID from Spotify URL
    // URLs can be: https://open.spotify.com/track/TRACKID or spotify:track:TRACKID
    const trackIdMatch = url.match(/track[:/]([a-zA-Z0-9]+)/);

    if (!trackIdMatch) {
      throw new Error('Invalid Spotify track URL');
    }

    const trackId = trackIdMatch[1];
    const response = await this.axiosInstance.get<SpotifyTrack>(`/tracks/${trackId}`);
    return response.data;
  }

  /**
   * Get playlist details by URL
   */
  async getPlaylistByUrl(url: string): Promise<SpotifyPlaylist> {
    const playlistIdMatch = url.match(/playlist[:/]([a-zA-Z0-9]+)/);

    if (!playlistIdMatch) {
      throw new Error('Invalid Spotify playlist URL');
    }

    const playlistId = playlistIdMatch[1];
    const response = await this.axiosInstance.get<SpotifyPlaylist>(`/playlists/${playlistId}`);
    return response.data;
  }
}
