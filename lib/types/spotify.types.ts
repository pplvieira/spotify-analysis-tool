export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

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

export interface PlaylistWithTracks extends SpotifyPlaylist {
  trackItems: SpotifyTrack[];
}

export interface SpotifyPagingObject<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface SavedTrack {
  added_at: string;
  track: SpotifyTrack;
}

export interface PlaylistTrack {
  added_at: string;
  track: SpotifyTrack;
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
