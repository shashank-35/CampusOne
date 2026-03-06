import { useLocation, Link } from 'react-router';
import { Menu, Bell, User } from 'lucide-react';
import { useStudentAuth } from '@/context/StudentAuthContext';

const PAGE_TITLES = {
  '/student-dashboard':       'Dashboard',
  '/student-courses':         'My Courses',
  '/student-events':          'Events',
  '/student-inquiry-status':  'Inquiry Status',
  '/student-notifications':   'Notifications',
  '/student-profile':         'My Profile',
  '/student-support':         'Support',
  '/student-settings':        'Settings',
};

export default function StudentTopbar({ onMenuClick }) {
  const location = useLocation();
  const { student } = useStudentAuth();
  const title = PAGE_TITLES[location.pathname] || 'Student Portal';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Link
          to="/student-notifications"
          className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Bell className="h-5 w-5" />
        </Link>

        <Link
          to="/student-profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
            {student?.firstName?.[0]}{student?.lastName?.[0]}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {student?.firstName}
          </span>
        </Link>
      </div>
    </header>
  );
}
