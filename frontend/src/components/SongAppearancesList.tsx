import type { SongAppearance } from '../types';

interface SongAppearancesListProps {
  songs: SongAppearance[];
}

const SongAppearancesList = ({ songs }: SongAppearancesListProps) => {
  if (songs.length === 0) {
    return <p style={{ color: 'var(--text-secondary)' }}>No songs found with the specified criteria.</p>;
  }

  return (
    <div>
      <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Found {songs.length} songs appearing in multiple playlists
      </p>
      <div className="song-list">
        {songs.map((song) => (
          <div key={song.trackId} className="song-item">
            {song.albumImageUrl && (
              <img src={song.albumImageUrl} alt={song.albumName} />
            )}
            <div className="song-info">
              <div className="song-name">
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                >
                  {song.trackName}
                </a>
              </div>
              <div className="song-artists">
                {song.artistNames.join(', ')} • {song.albumName}
              </div>
              <div className="playlists-list">
                Appears in: {song.playlists.map(pl => pl.name).join(', ')}
              </div>
            </div>
            <div className="song-count">
              {song.playlistCount} {song.playlistCount === 1 ? 'playlist' : 'playlists'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongAppearancesList;
