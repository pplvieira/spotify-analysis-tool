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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-spotify-darkgray via-spotify-black to-spotify-darkgray">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo/Icon */}
        <div>
          <svg className="mx-auto h-20 w-20 text-spotify-green" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <h1 className="mt-6 text-4xl font-bold text-spotify-white">
            Spotify Analysis Tool
          </h1>
          <p className="mt-4 text-lg text-spotify-lightgray leading-relaxed">
            Discover deep insights about your music library. Analyze playlists, find hidden patterns, and explore your listening habits.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Login Button */}
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-spotify-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting to Spotify...
              </span>
            ) : (
              'Login with Spotify'
            )}
          </button>
        </div>

        {/* Features List */}
        <div className="pt-8">
          <p className="text-sm text-spotify-lightgray mb-4">This app will access:</p>
          <div className="grid grid-cols-1 gap-3 text-left max-w-sm mx-auto">
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-spotify-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-spotify-lightgray">Your Spotify profile and account information</span>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-spotify-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-spotify-lightgray">Your public and private playlists</span>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-spotify-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-spotify-lightgray">Your saved tracks and liked songs</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-spotify-lightgray pt-8">
          Your data is never stored. All analysis happens in real-time.
        </p>
      </div>
    </div>
  );
};

export default Login;
