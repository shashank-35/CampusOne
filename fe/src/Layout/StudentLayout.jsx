import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useStudentAuth } from '@/context/StudentAuthContext';

const NAV_ITEMS = [
  { to: '/student-dashboard',       label: 'Dashboard',       icon: '🏠' },
  { to: '/student-courses',         label: 'Courses',         icon: '📚' },
  { to: '/student-events',          label: 'Events',          icon: '📅' },
  { to: '/student-inquiry-status',  label: 'My Inquiry',      icon: '📋' },
  { to: '/student-profile',         label: 'My Profile',      icon: '👤' },
];

export default function StudentLayout() {
  const { student, logout } = useStudentAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/student-login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-30 h-full w-64 bg-slate-800 flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-700">
          <h1 className="text-white font-bold text-xl tracking-tight">CampusOne</h1>
          <p className="text-slate-400 text-xs mt-0.5">Student Portal</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'}`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-semibold">
              {student?.firstName?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {student?.firstName} {student?.lastName}
              </p>
              <p className="text-slate-400 text-xs truncate">{student?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-gray-800">CampusOne</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
