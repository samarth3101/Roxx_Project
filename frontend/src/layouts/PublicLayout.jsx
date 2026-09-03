import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store } from 'lucide-react';

export const PublicLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#2B2924]">
      {/* Minimal Top Bar */}
      <header className="w-full border-b border-[#E8E5DF] bg-[#FFFFFF] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-[6px] bg-[#C9714F] flex items-center justify-center text-[#FFFFFF] shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm text-[#1A1815] tracking-tight">
              Roxx
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="text-xs font-medium text-[#C9714F] hover:text-[#B5613F] transition-colors"
              >
                Go to app →
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-medium text-[#2B2924] hover:text-[#1A1815] px-3 py-1.5 rounded-[6px] hover:bg-[#FAF9F6] border border-transparent hover:border-[#E8E5DF] transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Clean Single-line Footer */}
      <footer className="border-t border-[#E8E5DF] bg-[#FFFFFF] py-4 text-center text-xs text-[#8A8578]">
        <p>© 2026 Roxx Store Rating Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};
