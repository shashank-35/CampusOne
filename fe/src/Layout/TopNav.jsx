import { useState, useEffect, useRef } from 'react';
import { Bell, User, X, Check } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import notificationService from '@/services/notificationService';

export default function TopNav() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data.data?.notifications || []);
      setUnread(res.data.data?.unreadCount || 0);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    await notificationService.markAllRead().catch(() => {});
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
    setUnread(0);
  };

  const dismiss = async (id) => {
    await notificationService.delete(id).catch(() => {});
    setNotifications((n) => n.filter((x) => x._id !== id));
    fetchNotifications();
  };

  const TYPE_COLORS = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="text-sm text-gray-500 font-medium">
        Campus Management System
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => { setOpen((o) => !o); if (!open) fetchNotifications(); }}
            className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium leading-none">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <Check className="h-3 w-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${TYPE_COLORS[n.type] || 'bg-gray-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => dismiss(n._id)}
                        className="text-gray-300 hover:text-gray-600 flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile link */}
        <Link to="/profile" className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="h-5 w-5" />
          <span className="text-sm font-medium hidden md:inline">{user?.firstName}</span>
        </Link>
      </div>
    </header>
  );
}
