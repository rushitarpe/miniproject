import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route requiring authentication.
 * Optionally pass requiredRole="admin" to also enforce RBAC on frontend.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useAuth();

  if (!token || !user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
