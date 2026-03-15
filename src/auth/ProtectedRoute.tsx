import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, AdminRole } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: AdminRole[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-dark text-steel-light">
        <div className="text-sm text-steel">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

