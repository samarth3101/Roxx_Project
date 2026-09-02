import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChangePasswordModal } from './ChangePasswordModal';
import {
  Store,
  ShieldCheck,
  Building2,
  User,
  KeyRound,
  LogOut,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            System Administrator
          </span>
        );
      case 'STORE_OWNER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            Store Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <User className="w-3.5 h-3.5 text-slate-600" />
            Normal User
          </span>
        );
    }
  };

  const getHomeLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'STORE_OWNER') return '/owner';
    return '/stores';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to={getHomeLink()} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold font-display tracking-tight text-slate-900 flex items-center gap-1">
                ROXX <span className="text-blue-600">RATING</span>
              </span>
            </div>
          </Link>

          {/* User Status & Navigation */}
          {user ? (
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden md:flex items-center gap-3">
                {getRoleBadge(user.role)}
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px]" title={user.name}>
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[200px]" title={user.email}>
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                  title="Change Password"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Change Password</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-secondary text-xs py-2 px-3.5">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary text-xs py-2 px-3.5">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Change Password Dialog */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};
