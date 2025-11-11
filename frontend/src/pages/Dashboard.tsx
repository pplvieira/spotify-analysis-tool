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

      // Load user profile and stats
      const [profile, libraryStats] = await Promise.all([
        spotifyAPI.getProfile(),
        analysisAPI.getLibraryStats(),
      ]);

      setUser(profile);
      setStats(libraryStats);
      setLoading(false);

      // Auto-load song appearances
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
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your Spotify data...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />

      <div className="dashboard">
        {stats && <StatsCards stats={stats} />}

        {error && <div className="error">{error}</div>}

        <div className="analysis-section">
          <h2>Music Analysis</h2>

          <div className="analysis-controls">
            <div>
              <button
                className={`btn ${activeTab === 'songs' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('songs')}
              >
                Songs in Multiple Playlists
              </button>
              <button
                className={`btn ${activeTab === 'artists' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('artists')}
                style={{ marginLeft: '1rem' }}
              >
                Most Common Artists
              </button>
            </div>
          </div>

          {activeTab === 'songs' && (
            <>
              <div className="analysis-controls">
                <label>
                  Minimum appearances:
                  <input
                    type="number"
                    min="2"
                    value={minAppearances}
                    onChange={(e) => setMinAppearances(parseInt(e.target.value))}
                    style={{ marginLeft: '0.5rem', width: '80px' }}
                  />
                </label>
                <button
                  className="btn btn-primary"
                  onClick={handleAnalyze}
                  disabled={analysisLoading}
                >
                  {analysisLoading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>

              {songAppearances.length > 0 && (
                <SongAppearancesList songs={songAppearances} />
              )}
            </>
          )}

          {activeTab === 'artists' && (
            <>
              <div className="analysis-controls">
                <button
                  className="btn btn-primary"
                  onClick={handleAnalyze}
                  disabled={analysisLoading}
                >
                  {analysisLoading ? 'Analyzing...' : 'Load Top Artists'}
                </button>
              </div>

              {topArtists.length > 0 && (
                <ArtistsList artists={topArtists} />
              )}
            </>
          )}

          {analysisLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Analyzing your music library...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
