import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, MessageSquare, BookOpen,
  Calendar, Package, UserCircle, Activity, QrCode, LogOut, ClipboardList, CreditCard, Ticket,
} from 'lucide-react';

const NAV = {
  admin: [
    { label: 'Dashboard',   to: '/dashboard',    icon: LayoutDashboard },
    { label: 'Inquiries',   to: '/inquiry',      icon: MessageSquare },
    { label: 'Admissions',  to: '/admission',    icon: ClipboardList },
    { label: 'Payments',    to: '/payment',      icon: CreditCard },
    { label: 'Students',    to: '/student',      icon: GraduationCap },
    { label: 'Tickets',     to: '/tickets',      icon: Ticket },
    { label: 'Courses',     to: '/course',       icon: BookOpen },
    { label: 'Events',      to: '/event',        icon: Calendar },
    { label: 'Products',    to: '/product',      icon: Package },
    { label: 'Users',       to: '/user',         icon: Users },
    { label: 'QR Code',     to: '/qr-code',      icon: QrCode },
    { label: 'Activity Log',to: '/activity-log', icon: Activity },
    { label: 'My Profile',  to: '/profile',      icon: UserCircle },
  ],
  counselor: [
    { label: 'Dashboard',   to: '/dashboard',    icon: LayoutDashboard },
    { label: 'Inquiries',   to: '/inquiry',      icon: MessageSquare },
    { label: 'Admissions',  to: '/admission',    icon: ClipboardList },
    { label: 'Payments',    to: '/payment',      icon: CreditCard },
    { label: 'Tickets',     to: '/tickets',      icon: Ticket },
    { label: 'My Profile',  to: '/profile',      icon: UserCircle },
  ],
  receptionist: [
    { label: 'Dashboard',   to: '/dashboard',    icon: LayoutDashboard },
    { label: 'Inquiries',   to: '/inquiry',      icon: MessageSquare },
    { label: 'Admissions',  to: '/admission',    icon: ClipboardList },
    { label: 'Payments',    to: '/payment',      icon: CreditCard },
    { label: 'Students',    to: '/student',      icon: GraduationCap },
    { label: 'My Profile',  to: '/profile',      icon: UserCircle },
  ],
};

export default function Sidebar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user, logout: authLogout } = useAuth();

  const links = NAV[user?.role] || NAV.receptionist;

  const logout = () => {
    authLogout();
    navigate('/');
  };

  const isActive = (to) =>
    to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(to);

  return (
    <aside className="bg-slate-900 text-white w-64 h-full flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-tight">OmniHub</h1>
        <p className="text-slate-400 text-xs mt-0.5">Campus Management System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(to)
                ? 'bg-slate-700 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + Logout */}
      {user && (
        <div className="px-3 py-4 border-t border-slate-700 space-y-2">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-800/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
