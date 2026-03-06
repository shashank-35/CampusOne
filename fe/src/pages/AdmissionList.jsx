import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Plus, Search, Download, Eye, Pencil, Trash2, X } from 'lucide-react';
import admissionService from '@/services/admissionService';
import { useAuth } from '@/context/AuthContext';

const STATUS_BADGE = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const PAYMENT_BADGE = {
  pending: 'bg-orange-100 text-orange-700',
  partial: 'bg-blue-100 text-blue-700',
  paid:    'bg-green-100 text-green-700',
};

const STATUSES        = ['', 'pending', 'approved', 'rejected'];
const PAYMENT_STATUSES = ['', 'pending', 'partial', 'paid'];

export default function AdmissionList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin  = user?.role === 'admin';

  const [admissions, setAdmissions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [page, setPage]           = useState(1);
  const [deleting, setDeleting]   = useState(null);

  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search)        params.search        = search;
      if (status)        params.status        = status;
      if (paymentStatus) params.paymentStatus = paymentStatus;

      const res = await admissionService.getAll(params);
      setAdmissions(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      toast.error('Failed to load admissions');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, paymentStatus]);

  useEffect(() => { fetchAdmissions(); }, [fetchAdmissions]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, status, paymentStatus]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admission? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await admissionService.delete(id);
      toast.success('Admission deleted');
      fetchAdmissions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Student Name', 'Email', 'Mobile', 'Course', 'Batch', 'Total Fees', 'Discount', 'Final Fees', 'Payment', 'Status', 'Date'];
    const rows = admissions.map((a) => [
      a.studentName, a.email, a.mobile, a.courseName, a.batch || '',
      a.totalFees, a.discount, a.finalFees,
      a.paymentStatus, a.status,
      new Date(a.admissionDate || a.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'admissions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admissions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total admission{pagination.total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <Link
            to="/admission/create"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> New Admission
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, mobile, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="">All Payments</option>
          {PAYMENT_STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>

        {(search || status || paymentStatus) && (
          <button
            onClick={() => { setSearch(''); setStatus(''); setPaymentStatus(''); }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Course / Batch</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Fees</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-slate-800 mx-auto" />
                  </td>
                </tr>
              ) : admissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-gray-400">
                    <p className="text-3xl mb-2">📋</p>
                    <p className="font-medium">No admissions found</p>
                  </td>
                </tr>
              ) : (
                admissions.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{a.studentName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.email}</p>
                      <p className="text-xs text-gray-400">{a.mobile}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-800 font-medium">{a.courseName || '—'}</p>
                      {a.batch && <p className="text-xs text-gray-500 mt-0.5">{a.batch}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">₹{(a.finalFees ?? a.totalFees)?.toLocaleString()}</p>
                      {a.discount > 0 && (
                        <p className="text-xs text-green-600 mt-0.5">-₹{a.discount?.toLocaleString()} discount</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${PAYMENT_BADGE[a.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {a.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[a.status] || 'bg-gray-100 text-gray-600'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(a.admissionDate || a.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/admission/${a._id}`)}
                          className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {(isAdmin || user?.role === 'counselor') && (
                          <button
                            onClick={() => navigate(`/admission/edit/${a._id}`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(a._id)}
                            disabled={deleting === a._id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
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
