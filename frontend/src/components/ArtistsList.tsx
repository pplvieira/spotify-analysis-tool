import type { Artist } from '../types';

interface ArtistsListProps {
  artists: Artist[];
}

const ArtistsList = ({ artists }: ArtistsListProps) => {
  if (artists.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-spotify-lightgray">No artists data available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-spotify-lightgray">
          Your top <span className="text-spotify-green font-bold">{artists.length}</span> most common artists
        </p>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {artists.map((artist, index) => (
          <div
            key={artist.artistId}
            className="flex items-center gap-4 bg-spotify-black rounded-lg p-4 hover:bg-opacity-80 transition-all duration-200"
          >
            {/* Ranking Badge */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-spotify-green to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-spotify-black text-2xl font-bold">
                #{index + 1}
              </span>
            </div>

            {/* Artist Info */}
            <div className="flex-grow min-w-0">
              <div className="text-spotify-white font-bold text-xl mb-2">
                {artist.artistName}
              </div>
              <div className="text-spotify-lightgray text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-spotify-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                  <span>{artist.trackCount} unique {artist.trackCount === 1 ? 'track' : 'tracks'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-spotify-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>{artist.totalAppearances} total appearances</span>
                </div>
              </div>
            </div>

            {/* Track Count Display */}
            <div className="flex-shrink-0">
              <div className="bg-spotify-green text-spotify-black px-4 py-2 rounded-full font-bold text-center min-w-[80px]">
                <div className="text-2xl">{artist.trackCount}</div>
                <div className="text-xs uppercase tracking-wide">
                  {artist.trackCount === 1 ? 'track' : 'tracks'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistsList;
