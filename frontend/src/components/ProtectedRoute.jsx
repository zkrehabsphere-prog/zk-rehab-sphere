import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication and/or specific roles
 *
 * Usage:
 *   <ProtectedRoute>                          // Auth required only
 *   <ProtectedRoute roles={['admin']}>        // Admin only
 *   <ProtectedRoute roles={['admin','doctor']}> // Admin or Doctor
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // While checking auth status, show a screen-centered spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Role check — if specific roles required and user doesn't have them
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">
            This page requires {roles.join(' or ')} access. You are logged in as a{' '}
            <span className="font-semibold text-primary">{user?.role}</span>.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
