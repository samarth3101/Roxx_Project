import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

  const getRootRedirect = () => {
    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
    return <Navigate to="/stores" replace />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Initializing platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-blue-500 selection:text-white">
      <Navbar />

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

      {/* Global Clean Footer */}
      <footer className="border-t border-slate-200 bg-white/90 py-6 text-center text-xs text-slate-500 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Roxx Store Rating Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Secure Authentication</span>
            <span>•</span>
            <span>Role-Based Permissions</span>
            <span>•</span>
            <span>PostgreSQL & Express</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
