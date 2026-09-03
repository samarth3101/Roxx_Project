import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const AppLayout = () => {
  const location = useLocation();
  const isDashboardWithSidebar =
    location.pathname.startsWith('/app/admin') || location.pathname.startsWith('/app/owner');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#2B2924]">
      {!isDashboardWithSidebar && <Navbar />}

      <main className="flex-1">
        <Outlet />
      </main>

      {!isDashboardWithSidebar && (
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
