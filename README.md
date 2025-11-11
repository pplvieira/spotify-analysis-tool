# Spotify Analysis Tool

A full-stack web application that allows users to log into their Spotify account, analyze their playlists and liked songs, and discover insights about their music library.

## Features

- **Spotify OAuth Authentication**: Secure login with your Spotify account
- **Library Statistics**: View comprehensive stats about your music collection
- **Song Analysis**: Find songs that appear in multiple playlists, ordered by most appearances
- **Artist Analysis**: Discover your most common artists across all playlists
- **URL Support**: Access track and playlist metadata directly from Spotify URLs
- **Performance Optimized**: Handles thousands of songs and playlists efficiently

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **Spotify Web API** for data fetching
- **Session-based authentication** with OAuth 2.0
- **Axios** for HTTP requests

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API communication
- **CSS3** with Spotify-inspired design

## Project Structure

```
spotify-analysis-tool/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   └── server.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS styles
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Spotify Developer Account

### 1. Spotify App Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note your **Client ID** and **Client Secret**
4. Add `http://localhost:3001/api/auth/callback` to **Redirect URIs** in your app settings

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your Spotify credentials:
# SPOTIFY_CLIENT_ID=your_client_id_here
# SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file (optional)
cp .env.example .env
```

### 4. Running the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:3001`

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

### 5. Using the Application

1. Open `http://localhost:3000` in your browser
2. Click "Login with Spotify"
3. Authorize the application
4. You'll be redirected to the dashboard
5. View your library statistics
6. Click "Analyze" to find songs appearing in multiple playlists
7. Switch to "Most Common Artists" tab to see your top artists

## API Endpoints

### Authentication
- `GET /api/auth/login` - Get Spotify authorization URL
- `GET /api/auth/callback` - OAuth callback handler
- `GET /api/auth/session` - Get current session
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Spotify Data
- `GET /api/spotify/profile` - Get user profile
- `GET /api/spotify/playlists` - Get user playlists
- `GET /api/spotify/playlists/:id/tracks` - Get playlist tracks
- `GET /api/spotify/liked-songs` - Get liked songs
- `GET /api/spotify/playlists-with-tracks` - Get all playlists with tracks
- `GET /api/spotify/track?url=...` - Get track by URL
- `GET /api/spotify/playlist?url=...` - Get playlist by URL

### Analysis
- `GET /api/analysis/songs-in-multiple-playlists?minAppearances=2` - Find songs in multiple playlists
- `GET /api/analysis/library-stats` - Get library statistics
- `GET /api/analysis/duplicates` - Find duplicate songs
- `GET /api/analysis/most-common-artists?limit=20` - Get most common artists

## Features Details

### Songs in Multiple Playlists
This analysis finds all songs that appear in 2 or more of your playlists. It's optimized for performance:
- Uses Map data structure for O(1) lookups
- Handles thousands of songs efficiently
- Avoids counting duplicate songs within the same playlist
- Returns songs ordered by most appearances

### Library Statistics
Shows comprehensive stats including:
- Total playlists
- Unique tracks
- Liked songs count
- Unique artists
- Average tracks per playlist

### Most Common Artists
Analyzes your playlists to find artists that appear most frequently, showing:
- Number of unique tracks per artist
- Total appearances across all playlists

## Development

### Backend Development
```bash
cd backend
npm run dev          # Run with nodemon (hot reload)
npm run build        # Build for production
npm run type-check   # Check TypeScript types
```

### Frontend Development
```bash
cd frontend
npm run dev          # Run development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Check TypeScript types
```

## Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/callback
SESSION_SECRET=your_random_secret
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Production Deployment

For detailed deployment instructions, see:
- **[Quick Vercel Setup Guide](VERCEL_SETUP.md)** - Step-by-step guide for Vercel + Railway deployment
- **[Complete Deployment Guide](DEPLOYMENT.md)** - All deployment options and configurations

### Recommended Setup
- **Frontend**: Vercel (automatic preview & production deployments)
- **Backend**: Railway (supports persistent sessions)

### Quick Deploy Summary

1. **Deploy Backend to Railway**
   - Connect GitHub repository
   - Set root directory to `/backend`
   - Add environment variables
   - Auto-deploy on push

2. **Deploy Frontend to Vercel**
   - Import repository
   - Set root directory to `/frontend`
   - Add `VITE_API_URL` environment variable
   - Auto-deploy on push with preview deployments

3. **Update Spotify App**
   - Add production redirect URI to Spotify Dashboard

See [VERCEL_SETUP.md](VERCEL_SETUP.md) for complete step-by-step instructions.

## Security Notes

- Never commit `.env` files
- Keep your Spotify Client Secret secure
- Use HTTPS in production
- Set secure session cookies in production
- Implement rate limiting for production use

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!