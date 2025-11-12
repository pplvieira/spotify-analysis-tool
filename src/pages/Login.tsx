import { useState } from 'react';
import { authAPI } from '../services/api';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const authUrl = await authAPI.getLoginUrl();
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to initiate login');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <svg viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </div>

      <h1>Spotify Analysis Tool</h1>
      <p className="subtitle">
        Discover deep insights about your music library. Analyze playlists, find hidden patterns, and explore your listening habits.
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="login-button"
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Connecting to Spotify...
          </>
        ) : (
          'Login with Spotify'
        )}
      </button>

      <div className="features">
        <p className="features-title">This app will access:</p>
        <ul className="feature-list">
          <li className="feature-item">
            <svg className="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Your Spotify profile and account information</span>
          </li>
          <li className="feature-item">
            <svg className="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Your public and private playlists</span>
          </li>
          <li className="feature-item">
            <svg className="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Your saved tracks and liked songs</span>
          </li>
        </ul>
      </div>

      <p className="footer">
        Your data is never stored. All analysis happens in real-time.
      </p>
    </div>
  );
};

export default Login;
