import { PlaylistWithTracks, SongAppearance, SpotifyTrack } from '../types/spotify.types';

export class AnalysisService {
  /**
   * Find songs that appear in multiple playlists, ordered by most appearances
   * Optimized for handling thousands of songs
   */
  static findSongsInMultiplePlaylists(
    playlists: PlaylistWithTracks[],
    minAppearances: number = 2
  ): SongAppearance[] {
    // Use a Map for O(1) lookup performance
    const songMap = new Map<string, {
      track: SpotifyTrack;
      playlists: Array<{ id: string; name: string }>;
    }>();

    // Process each playlist
    for (const playlist of playlists) {
      // Use a Set to track unique songs in this playlist (avoid counting duplicates within same playlist)
      const processedInThisPlaylist = new Set<string>();

      for (const track of playlist.trackItems) {
        // Skip if we've already processed this track in this playlist
        if (processedInThisPlaylist.has(track.id)) {
          continue;
        }

        processedInThisPlaylist.add(track.id);

        // Get or create entry for this track
        const existing = songMap.get(track.id);

        if (existing) {
          // Add this playlist to the track's playlist list
          existing.playlists.push({
            id: playlist.id,
            name: playlist.name,
          });
        } else {
          // First time seeing this track
          songMap.set(track.id, {
            track,
            playlists: [{
              id: playlist.id,
              name: playlist.name,
            }],
          });
        }
      }
    }

    // Convert map to array and filter by minimum appearances
    const songAppearances: SongAppearance[] = [];

    for (const [trackId, data] of songMap.entries()) {
      const playlistCount = data.playlists.length;

      // Only include songs that appear in at least minAppearances playlists
      if (playlistCount >= minAppearances) {
        songAppearances.push({
          trackId,
          trackName: data.track.name,
          artistNames: data.track.artists.map(artist => artist.name),
          albumName: data.track.album.name,
          albumImageUrl: data.track.album.images[0]?.url || '',
          playlistCount,
          playlists: data.playlists,
          spotifyUrl: data.track.external_urls.spotify,
        });
      }
    }

    // Sort by playlist count (descending)
    songAppearances.sort((a, b) => b.playlistCount - a.playlistCount);

    return songAppearances;
  }

  /**
   * Get statistics about user's music library
   */
  static getLibraryStats(playlists: PlaylistWithTracks[], likedSongs: SpotifyTrack[]) {
    const totalPlaylists = playlists.length;
    const totalPlaylistTracks = playlists.reduce((sum, pl) => sum + pl.trackItems.length, 0);
    const totalLikedSongs = likedSongs.length;

    // Find unique tracks across all playlists
    const uniqueTrackIds = new Set<string>();
    for (const playlist of playlists) {
      for (const track of playlist.trackItems) {
        uniqueTrackIds.add(track.id);
      }
    }

    // Find unique artists
    const uniqueArtistIds = new Set<string>();
    for (const playlist of playlists) {
      for (const track of playlist.trackItems) {
        for (const artist of track.artists) {
          uniqueArtistIds.add(artist.id);
        }
      }
    }

    return {
      totalPlaylists,
      totalPlaylistTracks,
      totalLikedSongs,
      uniqueTracks: uniqueTrackIds.size,
      uniqueArtists: uniqueArtistIds.size,
      avgTracksPerPlaylist: totalPlaylists > 0 ? Math.round(totalPlaylistTracks / totalPlaylists) : 0,
    };
  }

  /**
   * Find duplicate songs across playlists (same song in multiple playlists)
   * Returns only songs that appear more than once
   */
  static findDuplicateSongs(playlists: PlaylistWithTracks[]): SongAppearance[] {
    return this.findSongsInMultiplePlaylists(playlists, 2);
  }

  /**
   * Get most common artists across all playlists
   */
  static getMostCommonArtists(playlists: PlaylistWithTracks[], limit: number = 20) {
    const artistMap = new Map<string, {
      name: string;
      count: number;
      trackIds: Set<string>;
    }>();

    for (const playlist of playlists) {
      for (const track of playlist.trackItems) {
        for (const artist of track.artists) {
          const existing = artistMap.get(artist.id);

          if (existing) {
            existing.count++;
            existing.trackIds.add(track.id);
          } else {
            artistMap.set(artist.id, {
              name: artist.name,
              count: 1,
              trackIds: new Set([track.id]),
            });
          }
        }
      }
    }

    const artists = Array.from(artistMap.entries()).map(([id, data]) => ({
      artistId: id,
      artistName: data.name,
      trackCount: data.trackIds.size,
      totalAppearances: data.count,
    }));

    artists.sort((a, b) => b.trackCount - a.trackCount);

    return artists.slice(0, limit);
  }
}
