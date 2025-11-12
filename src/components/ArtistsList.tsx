import type { Artist } from '../types';

interface ArtistsListProps {
  artists: Artist[];
}

const ArtistsList = ({ artists }: ArtistsListProps) => {
  if (artists.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">No artists data available.</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <p>
          Your top <span className="list-count">{artists.length}</span> most common artists
        </p>
      </div>

      <div className="list-items">
        {artists.map((artist, index) => (
          <div key={artist.artistId} className="list-item">
            {/* Ranking Badge */}
            <div className="ranking-badge">
              <span className="ranking-number">
                #{index + 1}
              </span>
            </div>

            {/* Artist Info */}
            <div className="artist-info">
              <div className="artist-name">
                {artist.artistName}
              </div>
              <div className="artist-stats">
                <div className="artist-stat-item">
                  <svg className="artist-stat-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                  <span>{artist.trackCount} unique {artist.trackCount === 1 ? 'track' : 'tracks'}</span>
                </div>
                <div className="artist-stat-item">
                  <svg className="artist-stat-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>{artist.totalAppearances} total appearances</span>
                </div>
              </div>
            </div>

            {/* Track Count Display */}
            <div className="item-badge">
              <div className="badge-value">{artist.trackCount}</div>
              <div className="badge-label">
                {artist.trackCount === 1 ? 'track' : 'tracks'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistsList;
