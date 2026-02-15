import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { setToken } = useAuth();

  return (
    <div className="app-shell">
      <nav>
        <h1>UCC</h1>
        <div className="links">
          <Link to="/profile">Profile</Link>
          <Link to="/matches">Matches</Link>
          <Link to="/insights">Graph</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/chat">Chat</Link>
          <button onClick={() => setToken(null)}>Logout</button>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
