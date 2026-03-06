import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import studentApi from '@/services/studentApi';
import toast from 'react-hot-toast';

function NotificationItem({ notif, onRead, onDelete }) {
  const icons = {
    inquiry:   '📋',
    event:     '📅',
    course:    '📚',
    admission: '🎓',
    payment:   '💳',
    general:   '🔔',
  };
  const icon = icons[notif.type] || icons.general;

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
        notif.read
          ? 'bg-gray-50 border-gray-100'
          : 'bg-white border-indigo-100 shadow-sm'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
        notif.read ? 'bg-gray-100' : 'bg-indigo-50'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${notif.read ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
          {notif.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(notif.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {!notif.read && (
          <button
            onClick={() => onRead(notif._id)}
            title="Mark as read"
            className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(notif._id)}
          title="Delete"
          className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetch = () => {
    studentApi.get('/notifications')
      .then((res) => setNotifications(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleRead = async (id) => {
    try {
      await studentApi.put(`/notifications/${id}`);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await studentApi.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.allSettled(unread.map((n) => studentApi.put(`/notifications/${n._id}`)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All marked as read');
  };

  const filtered = notifications.filter((n) =>
    filter === 'all' ? true : filter === 'unread' ? !n.read : n.read
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full font-semibold">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-indigo-200"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          [1,2,3,4].map((i) => (
            <div key={i} className="h-16 bg-white rounded-xl border border-gray-100 animate-pulse" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((n) => (
            <NotificationItem
              key={n._id}
              notif={n}
              onRead={handleRead}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="py-16 text-center">
            <Bell className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
