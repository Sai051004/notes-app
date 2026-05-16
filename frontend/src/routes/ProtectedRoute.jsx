import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className="flex h-screen items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
