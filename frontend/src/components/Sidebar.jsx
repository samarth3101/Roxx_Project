import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChangePasswordModal } from './ChangePasswordModal';
import {
  Store,
  Users,
  Building2,
  KeyRound,
  LogOut,
  Menu,
  X,
  Shield,
  Layers,
} from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isOwner = user?.role === 'STORE_OWNER';

  return (
    <>
      {/* Mobile Top Bar (visible on < md screens) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border-b border-[#E8E5DF] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[6px] bg-[#C9714F] flex items-center justify-center text-[#FFFFFF]">
            <Store className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-sm text-[#1A1815]">Store rating</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-[#8A8578] hover:text-[#1A1815] rounded-[6px] hover:bg-[#FAF9F6] focus-visible:ring-1 focus-visible:ring-[#4A6FA5]"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1A1815]/20 md:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop fixed 240px, Mobile slide-in) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-[240px] bg-[#FFFFFF] border-r border-[#E8E5DF] flex flex-col justify-between transition-transform duration-150 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Studio Brand Header */}
          <div className="h-14 px-5 flex items-center gap-2.5 border-b border-[#E8E5DF]">
            <div className="w-6 h-6 rounded-[6px] bg-[#C9714F] flex items-center justify-center text-[#FFFFFF] shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-sm text-[#1A1815] tracking-tight">Roxx</span>
              <span className="text-[11px] text-[#8A8578] font-normal">admin</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="py-3 flex flex-col">
            {isAdmin && (
              <>
                <div className="px-5 pb-1.5 pt-2 text-[11px] font-medium text-[#8A8578]">
                  Platform
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onTabChange) onTabChange('users');
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-5 py-2 text-[13px] text-left transition-colors cursor-pointer ${
                    activeTab === 'users' ? 'sidebar-active' : 'sidebar-inactive'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Users directory</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onTabChange) onTabChange('stores');
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-5 py-2 text-[13px] text-left transition-colors cursor-pointer ${
                    activeTab === 'stores' ? 'sidebar-active' : 'sidebar-inactive'
                  }`}
                >
                  <Store className="w-4 h-4 shrink-0" />
                  <span>Stores catalog</span>
                </button>
              </>
            )}

            {isOwner && (
              <>
                <div className="px-5 pb-1.5 pt-2 text-[11px] font-medium text-[#8A8578]">
                  Management
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2.5 px-5 py-2 text-[13px] text-left sidebar-active cursor-pointer"
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>Store overview</span>
                </button>
              </>
            )}

            {/* General link to normal stores browse for admins/owners */}
            <div className="px-5 pb-1.5 pt-4 text-[11px] font-medium text-[#8A8578]">
              Public view
            </div>
            <Link
              to="/stores"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-5 py-2 text-[13px] transition-colors ${
                location.pathname === '/stores' ? 'sidebar-active' : 'sidebar-inactive'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Customer store view</span>
            </Link>
          </nav>
        </div>

        {/* User Account & Actions Footer */}
        <div className="p-3 border-t border-[#E8E5DF] flex flex-col gap-1">
          <div className="px-2 py-1.5 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1A1815] truncate max-w-[140px]" title={user?.name}>
                {user?.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E5DF] text-[#8A8578]">
                {isAdmin ? 'admin' : isOwner ? 'owner' : 'user'}
              </span>
            </div>
            <span className="text-[11px] text-[#8A8578] truncate" title={user?.email}>
              {user?.email}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E8E5DF]/60">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-2 py-1 text-xs text-[#8A8578] hover:text-[#1A1815] hover:bg-[#FAF9F6] rounded flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A6FA5]"
              title="Change password"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-2 py-1 text-xs text-[#B5544A] hover:bg-[#FAF9F6] rounded flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A6FA5]"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};
