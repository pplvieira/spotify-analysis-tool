import type { LibraryStats } from '../types';

interface StatsCardsProps {
  stats: LibraryStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>{stats.totalPlaylists}</h3>
        <p>Total Playlists</p>
      </div>
      <div className="stat-card">
        <h3>{stats.uniqueTracks}</h3>
        <p>Unique Tracks</p>
      </div>
      <div className="stat-card">
        <h3>{stats.totalLikedSongs}</h3>
        <p>Liked Songs</p>
      </div>
      <div className="stat-card">
        <h3>{stats.uniqueArtists}</h3>
        <p>Unique Artists</p>
      </div>
      <div className="stat-card">
        <h3>{stats.avgTracksPerPlaylist}</h3>
        <p>Avg Tracks/Playlist</p>
      </div>
    </div>
  );
};

export default StatsCards;
