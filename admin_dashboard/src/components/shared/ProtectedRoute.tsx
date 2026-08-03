import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Checking your session…" />;
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  if (profile && !isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 bg-background text-center">
        <h1 className="text-2xl font-bold text-accent">Access Denied</h1>
        <p className="text-gray-600">
          This dashboard is restricted to Royal Transportation administrators.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
