import type { SongAppearance } from '../types';

interface SongAppearancesListProps {
  songs: SongAppearance[];
}

const SongAppearancesList = ({ songs }: SongAppearancesListProps) => {
  if (songs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-spotify-lightgray">No songs found with the specified criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-spotify-lightgray">
          Found <span className="text-spotify-green font-bold">{songs.length}</span> songs appearing in multiple playlists
        </p>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {songs.map((song) => (
          <div
            key={song.trackId}
            className="flex items-center gap-4 bg-spotify-black rounded-lg p-4 hover:bg-opacity-80 transition-all duration-200 group"
          >
            {/* Album Cover */}
            {song.albumImageUrl && (
              <img
                src={song.albumImageUrl}
                alt={song.albumName}
                className="w-16 h-16 rounded-md shadow-md flex-shrink-0"
              />
            )}

            {/* Song Info */}
            <div className="flex-grow min-w-0">
              <div className="mb-1">
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-spotify-white font-semibold hover:text-spotify-green transition-colors duration-200 text-lg group-hover:underline"
                >
                  {song.trackName}
                </a>
              </div>
              <div className="text-spotify-lightgray text-sm mb-2">
                {song.artistNames.join(', ')} • {song.albumName}
              </div>
              <div className="text-spotify-lightgray text-xs">
                <span className="font-medium">Appears in:</span>{' '}
                {song.playlists.map(pl => pl.name).join(', ')}
              </div>
            </div>

            {/* Playlist Count Badge */}
            <div className="flex-shrink-0">
              <div className="bg-spotify-green text-spotify-black px-4 py-2 rounded-full font-bold text-center min-w-[80px]">
                <div className="text-2xl">{song.playlistCount}</div>
                <div className="text-xs uppercase tracking-wide">
                  {song.playlistCount === 1 ? 'playlist' : 'playlists'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongAppearancesList;
