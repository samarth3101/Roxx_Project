import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserStoresPage } from './pages/UserStoresPage';
import { StoreOwnerDashboard } from './pages/StoreOwnerDashboard';

export const App = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const getRootRedirect = () => {
    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
    return <Navigate to="/stores" replace />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="flex flex-col items-center gap-2 text-[#8A8578]">
          <div className="w-5 h-5 border-2 border-[#C9714F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Initializing...</p>
        </div>
      </div>
    );
  }

  // Determine if we should show the top navbar (only for customer stores view or public general view)
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/owner');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';
  const showTopNav = !isDashboardRoute && !isAuthRoute;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#2B2924]">
      {showTopNav && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? getRootRedirect() : <LoginPage />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? getRootRedirect() : <SignupPage />}
          />

          {/* Role-Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <UserStoresPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Root Redirect */}
          <Route path="/" element={getRootRedirect()} />
          <Route path="*" element={getRootRedirect()} />
        </Routes>
      </main>

      {/* Global Minimal Footer only on non-dashboard views */}
      {showTopNav && (
        <footer className="border-t border-[#E8E5DF] bg-[#FFFFFF] py-4 text-center text-xs text-[#8A8578]">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 Roxx Store Rating Platform. All rights reserved.</p>
            <div className="flex items-center gap-3 text-[#8A8578]">
              <span>Verified ratings</span>
              <span>•</span>
              <span>Role permissions</span>
              <span>•</span>
              <span>PostgreSQL</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
