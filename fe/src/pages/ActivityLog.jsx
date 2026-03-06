import { useEffect, useState } from 'react';
import { Activity, Search, User } from 'lucide-react';
import api from '@/services/api';

const MODULE_COLORS = {
  Inquiry:  'bg-blue-100 text-blue-700',
  Student:  'bg-green-100 text-green-700',
  User:     'bg-purple-100 text-purple-700',
  Course:   'bg-orange-100 text-orange-700',
  Profile:  'bg-cyan-100 text-cyan-700',
};

const ActionBadge = ({ action }) => {
  const colors = {
    CREATE: 'bg-emerald-100 text-emerald-700',
    UPDATE: 'bg-blue-100 text-blue-700',
    DELETE: 'bg-red-100 text-red-700',
    ASSIGN: 'bg-purple-100 text-purple-700',
    CONVERT:'bg-yellow-100 text-yellow-700',
    NOTE:   'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[action] || 'bg-gray-100 text-gray-700'}`}>
      {action}
    </span>
  );
};

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filterModule, setFilterModule] = useState('');

  const fetchLogs = async (p = 1, mod = filterModule) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 20 };
      if (mod) params.module = mod;
      const res = await api.get('/activity-logs', { params });
      setLogs(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(1); }, []);

  const handleModuleFilter = (mod) => {
    setFilterModule(mod);
    setPage(1);
    fetchLogs(1, mod);
  };

  const modules = ['', 'Inquiry', 'Student', 'User', 'Course', 'Profile'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-500 text-sm mt-1">Track all system activities and changes.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex gap-2 flex-wrap">
        {modules.map((mod) => (
          <button
            key={mod || 'all'}
            onClick={() => handleModuleFilter(mod)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterModule === mod
                ? 'bg-slate-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {mod || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Action</th>
                <th className="p-4 text-left">Module</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400">No activity logs found</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="w-3 h-3 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs">
                            {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown'}
                          </p>
                          <p className="text-gray-400 text-xs capitalize">{log.user?.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><ActionBadge action={log.action} /></td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${MODULE_COLORS[log.module] || 'bg-gray-100 text-gray-700'}`}>
                        {log.module}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-xs">{log.description}</td>
                    <td className="p-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
            <p>Page {pagination.page} of {pagination.pages} ({pagination.total} entries)</p>
            <div className="flex gap-2">
              <button
                onClick={() => { const p = page - 1; setPage(p); fetchLogs(p); }}
                disabled={page <= 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => { const p = page + 1; setPage(p); fetchLogs(p); }}
                disabled={page >= pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
