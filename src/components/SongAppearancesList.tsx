import type { SongAppearance } from '../types';

interface SongAppearancesListProps {
  songs: SongAppearance[];
}

const SongAppearancesList = ({ songs }: SongAppearancesListProps) => {
  if (songs.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">No songs found with the specified criteria.</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <p>
          Found <span className="list-count">{songs.length}</span> songs appearing in multiple playlists
        </p>
      </div>

      <div className="list-items">
        {songs.map((song) => (
          <div key={song.trackId} className="list-item">
            {/* Album Cover */}
            {song.albumImageUrl && (
              <img
                src={song.albumImageUrl}
                alt={song.albumName}
                className="item-image"
              />
            )}

            {/* Song Info */}
            <div className="item-content">
              <div>
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="item-title"
                >
                  {song.trackName}
                </a>
              </div>
              <div className="item-subtitle">
                {song.artistNames.join(', ')} • {song.albumName}
              </div>
              <div className="item-details">
                <span className="item-details-label">Appears in:</span>{' '}
                {song.playlists.map(pl => pl.name).join(', ')}
              </div>
            </div>

            {/* Playlist Count Badge */}
            <div className="item-badge">
              <div className="badge-value">{song.playlistCount}</div>
              <div className="badge-label">
                {song.playlistCount === 1 ? 'playlist' : 'playlists'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongAppearancesList;
