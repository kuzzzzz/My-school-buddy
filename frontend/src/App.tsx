import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { MatchesPage } from './pages/MatchesPage';
import { InsightsPage } from './pages/InsightsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ChatPage } from './pages/ChatPage';

function ProtectedRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/profile" />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const { token } = useAuth();
  return token ? <ProtectedRoutes /> : <AuthPage />;
}
