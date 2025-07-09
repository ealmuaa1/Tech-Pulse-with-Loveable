import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const user = useUser();
  const location = useLocation();
  
  // Supabase useUser doesn't provide loading state, so we'll check if user is null
  const loading = user === null;

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">
              Verifying authentication...
            </p>
          </div>
        </div>
      )
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("ProtectedRoute: User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

// Loading component for consistent loading states
export const AuthLoadingSpinner: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};
