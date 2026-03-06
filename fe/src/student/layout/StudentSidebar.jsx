import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useStudentAuth } from '@/context/StudentAuthContext';
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  Bell, User, LifeBuoy, Settings, LogOut, GraduationCap,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard',      to: '/student-dashboard',        icon: LayoutDashboard },
  { label: 'My Courses',     to: '/student-courses',          icon: BookOpen },
  { label: 'Events',         to: '/student-events',           icon: Calendar },
  { label: 'Inquiry Status', to: '/student-inquiry-status',   icon: ClipboardList },
  { label: 'Notifications',  to: '/student-notifications',    icon: Bell },
  { label: 'Profile',        to: '/student-profile',          icon: User },
  { label: 'Support',        to: '/student-support',          icon: LifeBuoy },
  { label: 'Settings',       to: '/student-settings',         icon: Settings },
];

export default function StudentSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, logout } = useStudentAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (to) => location.pathname === to;

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-white font-bold text-sm leading-tight">OmniHub</p>
              <p className="text-slate-400 text-[10px]">Student Portal</p>
            </div>
          )}
        </div>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {/* Desktop collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
              isActive(to)
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {student?.firstName?.[0]}{student?.lastName?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {student?.firstName} {student?.lastName}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{student?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 z-50 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-full bg-slate-900 transition-all duration-300 flex-shrink-0 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {SidebarContent}
      </aside>
    </>
  );
}
