import axios from 'axios';
import type {
  SpotifyUser,
  SpotifyPlaylist,
  SpotifyTrack,
  AnalysisResponse,
  LibraryStats,
  SessionResponse,
  AuthUrlResponse,
  Artist,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const authAPI = {
  getLoginUrl: async (): Promise<string> => {
    const response = await api.get<AuthUrlResponse>('/auth/login');
    return response.data.authUrl;
  },

  getSession: async (): Promise<SessionResponse> => {
    const response = await api.get<SessionResponse>('/auth/session');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (): Promise<void> => {
    await api.post('/auth/refresh');
  },
};

// Spotify data endpoints
export const spotifyAPI = {
  getProfile: async (): Promise<SpotifyUser> => {
    const response = await api.get<SpotifyUser>('/spotify/profile');
    return response.data;
  },

  getPlaylists: async (): Promise<SpotifyPlaylist[]> => {
    const response = await api.get<SpotifyPlaylist[]>('/spotify/playlists');
    return response.data;
  },

  getPlaylistTracks: async (playlistId: string): Promise<SpotifyTrack[]> => {
    const response = await api.get<SpotifyTrack[]>(`/spotify/playlists/${playlistId}/tracks`);
    return response.data;
  },

  getLikedSongs: async (): Promise<SpotifyTrack[]> => {
    const response = await api.get<SpotifyTrack[]>('/spotify/liked-songs');
    return response.data;
  },

  getTrackByUrl: async (url: string): Promise<SpotifyTrack> => {
    const response = await api.get<SpotifyTrack>('/spotify/track', {
      params: { url },
    });
    return response.data;
  },

  getPlaylistByUrl: async (url: string): Promise<SpotifyPlaylist> => {
    const response = await api.get<SpotifyPlaylist>('/spotify/playlist', {
      params: { url },
    });
    return response.data;
  },
};

// Analysis endpoints
export const analysisAPI = {
  findSongsInMultiplePlaylists: async (minAppearances: number = 2): Promise<AnalysisResponse> => {
    const response = await api.get<AnalysisResponse>('/analysis/songs-in-multiple-playlists', {
      params: { minAppearances },
    });
    return response.data;
  },

  getLibraryStats: async (): Promise<LibraryStats> => {
    const response = await api.get<LibraryStats>('/analysis/library-stats');
    return response.data;
  },

  findDuplicates: async (): Promise<AnalysisResponse> => {
    const response = await api.get<AnalysisResponse>('/analysis/duplicates');
    return response.data;
  },

  getMostCommonArtists: async (limit: number = 20): Promise<{ totalPlaylists: number; artists: Artist[] }> => {
    const response = await api.get<{ totalPlaylists: number; artists: Artist[] }>('/analysis/most-common-artists', {
      params: { limit },
    });
    return response.data;
  },
};

export default api;
