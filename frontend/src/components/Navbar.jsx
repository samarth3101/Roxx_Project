import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChangePasswordModal } from './ChangePasswordModal';
import {
  Store,
  KeyRound,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'STORE_OWNER') return '/owner';
    return '/stores';
  };

  const hasAdminOrOwnerAccess = user?.role === 'ADMIN' || user?.role === 'STORE_OWNER';

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-[#E8E5DF] bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to={getDashboardLink()} className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-[6px] bg-[#C9714F] flex items-center justify-center text-[#FFFFFF] shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm text-[#1A1815] tracking-tight">
              Roxx <span className="text-[#8A8578] font-normal">ratings</span>
            </span>
          </Link>

          {/* User Status & Navigation */}
          {user ? (
            <div className="flex items-center gap-3">
              {hasAdminOrOwnerAccess && (
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/owner'}
                  className="px-2.5 py-1 text-xs text-[#8A8578] hover:text-[#1A1815] hover:bg-[#FAF9F6] rounded-[6px] transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin dashboard</span>
                </Link>
              )}

              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-medium text-[#1A1815] truncate max-w-[160px]" title={user.name}>
                  {user.name}
                </span>
                <span className="text-[11px] text-[#8A8578] truncate max-w-[160px]">
                  {user.email}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 border-l border-[#E8E5DF] pl-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-2.5 py-1 text-xs text-[#8A8578] hover:text-[#1A1815] hover:bg-[#FAF9F6] rounded-[6px] transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A6FA5]"
                  title="Change password"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Password</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-[#B5544A] hover:bg-[#FAF9F6] rounded-[6px] transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A6FA5]"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Sign out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary py-1.5 px-3 text-xs">
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary py-1.5 px-3 text-xs">
                Create account
              </Link>
            </div>
          )}
        </div>
      </header>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};
