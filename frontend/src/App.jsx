import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserStoresPage } from './pages/UserStoresPage';
import { StoreOwnerDashboard } from './pages/StoreOwnerDashboard';

// Helper to determine role-based destination under /app
const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/app/admin" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/app/owner" replace />;
  return <Navigate to="/app/stores" replace />;
};

export const App = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const getRoleRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/app/admin" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/app/owner" replace />;
    return <Navigate to="/app/stores" replace />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="flex flex-col items-center gap-2 text-[#8A8578]">
          <div className="w-5 h-5 border-2 border-[#C9714F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Initializing platform...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Marketing Route: Homepage at "/" */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Public Auth Routes (Redirect into /app if already logged in) */}
      <Route
        path="/login"
        element={isAuthenticated ? getRoleRedirect() : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? getRoleRedirect() : <SignupPage />}
      />

      {/* Authenticated / App Routes under "/app/*" */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* /app default index redirects based on user role */}
        <Route index element={<RoleRedirect />} />

        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="owner"
          element={
            <ProtectedRoute allowedRoles={['STORE_OWNER']}>
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="stores"
          element={
            <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
              <UserStoresPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<RoleRedirect />} />
      </Route>

      {/* Backward-compatibility aliases for existing bookmarks */}
      <Route path="/admin" element={<Navigate to="/app/admin" replace />} />
      <Route path="/owner" element={<Navigate to="/app/owner" replace />} />
      <Route path="/stores" element={<Navigate to="/app/stores" replace />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
