import type { SpotifyUser } from '../types';

interface HeaderProps {
  user: SpotifyUser | null;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="header">
      <h1>Spotify Analysis Tool</h1>
      {user && (
        <div className="user-info">
          {user.images[0] && <img src={user.images[0].url} alt={user.display_name} />}
          <span>{user.display_name}</span>
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
