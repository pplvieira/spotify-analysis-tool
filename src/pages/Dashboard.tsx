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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-spotify-green mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-spotify-lightgray">Loading your Spotify data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-darkgray">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && <StatsCards stats={stats} />}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Analysis Section */}
        <div className="mt-8 card">
          <h2 className="text-2xl font-bold text-spotify-white mb-6">Music Analysis</h2>

          {/* Tab Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('songs')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'songs'
                  ? 'bg-spotify-green text-spotify-black'
                  : 'bg-spotify-black text-spotify-lightgray hover:text-spotify-white'
              }`}
            >
              Songs in Multiple Playlists
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'artists'
                  ? 'bg-spotify-green text-spotify-black'
                  : 'bg-spotify-black text-spotify-lightgray hover:text-spotify-white'
              }`}
            >
              Most Common Artists
            </button>
          </div>

          {/* Songs Tab */}
          {activeTab === 'songs' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center gap-3">
                  <span className="text-spotify-lightgray">Minimum appearances:</span>
                  <input
                    type="number"
                    min="2"
                    value={minAppearances}
                    onChange={(e) => setMinAppearances(parseInt(e.target.value))}
                    className="bg-spotify-black text-spotify-white border border-spotify-gray rounded-lg px-4 py-2 w-24 focus:outline-none focus:border-spotify-green"
                  />
                </label>
                <button
                  onClick={handleAnalyze}
                  disabled={analysisLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="space-y-6">
              <button
                onClick={handleAnalyze}
                disabled={analysisLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="mt-8 text-center py-12">
              <svg className="animate-spin h-10 w-10 text-spotify-green mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-spotify-lightgray">Analyzing your music library...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
