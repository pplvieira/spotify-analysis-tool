import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, spotifyAPI, analysisAPI } from '../services/api';
import type { SpotifyUser, LibraryStats, SongAppearance, Artist } from '../types';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import SongAppearancesList from '../components/SongAppearancesList';
import ArtistsList from '../components/ArtistsList';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [songAppearances, setSongAppearances] = useState<SongAppearance[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minAppearances, setMinAppearances] = useState(2);
  const [activeTab, setActiveTab] = useState<'songs' | 'artists'>('songs');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authAPI.getSession();
      if (!session.authenticated) {
        navigate('/');
        return;
      }

      const [profile, libraryStats] = await Promise.all([
        spotifyAPI.getProfile(),
        analysisAPI.getLibraryStats(),
      ]);

      setUser(profile);
      setStats(libraryStats);
      setLoading(false);

      loadSongAppearances(2);
    } catch (err: any) {
      console.error('Auth check failed:', err);
      if (err.response?.status === 401) {
        navigate('/');
      } else {
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    }
  };

  const loadSongAppearances = async (minCount: number) => {
    try {
      setAnalysisLoading(true);
      setError(null);
      const response = await analysisAPI.findSongsInMultiplePlaylists(minCount);
      setSongAppearances(response.songs);
      setAnalysisLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze songs');
      setAnalysisLoading(false);
    }
  };

  const loadTopArtists = async (limit: number = 20) => {
    try {
      setAnalysisLoading(true);
      setError(null);
      const response = await analysisAPI.getMostCommonArtists(limit);
      setTopArtists(response.artists);
      setAnalysisLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze artists');
      setAnalysisLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (activeTab === 'songs') {
      loadSongAppearances(minAppearances);
    } else {
      loadTopArtists(20);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner-large">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="loading-text">Loading your Spotify data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header user={user} onLogout={handleLogout} />

      <main className="dashboard-main">
        {/* Stats Cards */}
        {stats && <StatsCards stats={stats} />}

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {/* Analysis Section */}
        <div className="card">
          <h2 className="card-title">Music Analysis</h2>

          {/* Tab Buttons */}
          <div className="tab-container">
            <button
              onClick={() => setActiveTab('songs')}
              className={`tab-button ${activeTab === 'songs' ? 'active' : 'inactive'}`}
            >
              Songs in Multiple Playlists
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`tab-button ${activeTab === 'artists' ? 'active' : 'inactive'}`}
            >
              Most Common Artists
            </button>
          </div>

          {/* Songs Tab */}
          {activeTab === 'songs' && (
            <div>
              <div className="analysis-controls">
                <label className="control-label">
                  <span>Minimum appearances:</span>
                  <input
                    type="number"
                    min="2"
                    value={minAppearances}
                    onChange={(e) => setMinAppearances(parseInt(e.target.value))}
                    className="control-input"
                  />
                </label>
                <button
                  onClick={handleAnalyze}
                  disabled={analysisLoading}
                  className="btn-primary"
                >
                  {analysisLoading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>

              {songAppearances.length > 0 && (
                <SongAppearancesList songs={songAppearances} />
              )}
            </div>
          )}

          {/* Artists Tab */}
          {activeTab === 'artists' && (
            <div>
              <button
                onClick={handleAnalyze}
                disabled={analysisLoading}
                className="btn-primary"
                style={{marginBottom: '1.5rem'}}
              >
                {analysisLoading ? 'Analyzing...' : 'Load Top Artists'}
              </button>

              {topArtists.length > 0 && (
                <ArtistsList artists={topArtists} />
              )}
            </div>
          )}

          {/* Loading State */}
          {analysisLoading && (
            <div className="analyzing-container">
              <div className="analyzing-spinner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="loading-text">Analyzing your music library...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
