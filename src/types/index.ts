export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  country: string;
  product: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: Array<{
    id: string;
    name: string;
    uri: string;
  }>;
  album: {
    id: string;
    name: string;
    uri: string;
    images: Array<{ url: string; height: number; width: number }>;
    release_date: string;
  };
  duration_ms: number;
  popularity: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  uri: string;
  images: Array<{ url: string }>;
  tracks: {
    total: number;
    href: string;
  };
  owner: {
    id: string;
    display_name: string;
  };
  public: boolean;
  collaborative: boolean;
  external_urls: {
    spotify: string;
  };
}

export interface SongAppearance {
  trackId: string;
  trackName: string;
  artistNames: string[];
  albumName: string;
  albumImageUrl: string;
  playlistCount: number;
  playlists: Array<{
    id: string;
    name: string;
  }>;
  spotifyUrl: string;
}

export interface LibraryStats {
  totalPlaylists: number;
  totalPlaylistTracks: number;
  totalLikedSongs: number;
  uniqueTracks: number;
  uniqueArtists: number;
  avgTracksPerPlaylist: number;
}

export interface AnalysisResponse {
  totalPlaylists: number;
  songsFound: number;
  songs: SongAppearance[];
}

export interface SessionResponse {
  authenticated: boolean;
  user?: SpotifyUser;
}

export interface AuthUrlResponse {
  authUrl: string;
}

export interface Artist {
  artistId: string;
  artistName: string;
  trackCount: number;
  totalAppearances: number;
}
