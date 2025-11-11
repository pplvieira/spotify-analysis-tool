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
      <h1>Spotify Analysis Tool</h1>
      <p>
        Analyze your Spotify playlists and discover insights about your music library.
        Find songs that appear in multiple playlists, get statistics about your collection,
        and explore your most listened artists.
      </p>

      {error && <div className="error">{error}</div>}

      <button
        className="btn btn-primary"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Connecting...' : 'Login with Spotify'}
      </button>

      <div style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>This app requires access to:</p>
        <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '0.5rem' }}>
          <li>Your profile information</li>
          <li>Your playlists</li>
          <li>Your liked songs</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
