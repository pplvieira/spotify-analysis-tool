import type { Artist } from '../types';

interface ArtistsListProps {
  artists: Artist[];
}

const ArtistsList = ({ artists }: ArtistsListProps) => {
  if (artists.length === 0) {
    return <p style={{ color: 'var(--text-secondary)' }}>No artists data available.</p>;
  }

  return (
    <div>
      <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Your top {artists.length} most common artists
      </p>
      <div className="song-list">
        {artists.map((artist, index) => (
          <div key={artist.artistId} className="song-item">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--spotify-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--spotify-black)'
            }}>
              #{index + 1}
            </div>
            <div className="song-info">
              <div className="song-name">{artist.artistName}</div>
              <div className="song-artists">
                {artist.trackCount} unique tracks • {artist.totalAppearances} total appearances
              </div>
            </div>
            <div className="song-count">
              {artist.trackCount} {artist.trackCount === 1 ? 'track' : 'tracks'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistsList;
