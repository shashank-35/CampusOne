import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import api from '@/services/api';

const ROLE_STYLES = {
  admin: 'bg-red-100 text-red-700',
  counselor: 'bg-purple-100 text-purple-700',
  receptionist: 'bg-blue-100 text-blue-700',
};

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [viewUser, setViewUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { search, role: roleFilter, limit: 100 } });
      setUsers(res.data.data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">Manage staff accounts and roles.</p>
        </div>
        <Link to="/user/create">
          <Button className="bg-slate-800 hover:bg-slate-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by name or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="counselor">Counselor</option>
          <option value="receptionist">Receptionist</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="p-4 text-left">NAME</th>
              <th className="p-4 text-left">EMAIL</th>
              <th className="p-4 text-left">MOBILE</th>
              <th className="p-4 text-left">ROLE</th>
              <th className="p-4 text-left">STATUS</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-400">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-400">No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4 text-gray-600">{u.mobileNumber || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${ROLE_STYLES[u.role] || 'bg-gray-100 text-gray-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-blue-600" onClick={() => setViewUser(u)}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-green-600" onClick={() => navigate(`/user/edit/${u._id}`)}><Edit className="h-3.5 w-3.5" /></Button>
                      {u.role !== 'admin' && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-red-600" onClick={() => handleDelete(u._id, `${u.firstName} ${u.lastName}`)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          {users.length} user{users.length !== 1 ? 's' : ''} total
        </div>
      </div>

      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 font-bold text-lg">
                  {viewUser.firstName?.[0]}{viewUser.lastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{viewUser.firstName} {viewUser.lastName}</p>
                  <p className="text-gray-500 text-xs">{viewUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100">
                {[
                  ['Mobile', viewUser.mobileNumber || '—'],
                  ['Role', viewUser.role],
                  ['Status', viewUser.status],
                  ['City', viewUser.city || '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-gray-400 uppercase font-medium">{k}</p>
                    <p className="text-gray-800 capitalize">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs" onClick={() => { setViewUser(null); navigate(`/user/edit/${viewUser._id}`); }}>
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button variant="outline" className="flex-1 text-xs" onClick={() => setViewUser(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
