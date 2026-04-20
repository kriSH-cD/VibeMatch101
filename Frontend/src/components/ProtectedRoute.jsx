import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-surface)' }}>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
               style={{ borderColor: 'var(--color-primary-container)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.9rem' }}>Loading…</p>
        </div>
      </div>
    );
  }

  // Not authenticated → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but no profile → create profile
  if (!profile) {
    return <Navigate to="/create-profile" replace />;
  }

  return children;
}
