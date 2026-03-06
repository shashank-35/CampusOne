import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Plus, Search, Download, Eye, Pencil, Trash2, Receipt, X } from 'lucide-react';
import paymentService from '@/services/paymentService';
import { useAuth } from '@/context/AuthContext';

const STATUS_BADGE = {
  pending: 'bg-orange-100 text-orange-700',
  partial: 'bg-blue-100 text-blue-700',
  paid:    'bg-green-100 text-green-700',
};

const METHOD_BADGE = {
  cash: 'bg-gray-100 text-gray-700',
  upi:  'bg-purple-100 text-purple-700',
  card: 'bg-blue-100 text-blue-700',
  bank: 'bg-slate-100 text-slate-700',
};

const STATUSES = ['pending', 'partial', 'paid'];
const METHODS  = ['cash', 'upi', 'card', 'bank'];

export default function PaymentList() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const isAdmin   = user?.role === 'admin';
  const canEdit   = isAdmin || user?.role === 'counselor';

  const [payments, setPayments]   = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [method, setMethod]       = useState('');
  const [page, setPage]           = useState(1);
  const [downloading, setDownloading] = useState(null);
  const [deleting, setDeleting]   = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search        = search;
      if (status) params.status        = status;
      if (method) params.paymentMethod = method;
      const res = await paymentService.getAll(params);
      setPayments(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, method]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);
  useEffect(() => { setPage(1); }, [search, status, method]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment record? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await paymentService.delete(id);
      toast.success('Payment deleted');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handleReceipt = async (id) => {
    setDownloading(id);
    try {
      await paymentService.downloadReceipt(id);
      toast.success('Receipt downloaded');
    } catch {
      toast.error('Failed to generate receipt');
    } finally {
      setDownloading(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Receipt No.', 'Student', 'Email', 'Course', 'Total Fees', 'Paid', 'Remaining', 'Method', 'Transaction ID', 'Status', 'Date'];
    const rows = payments.map((p) => [
      p.receiptNumber, p.studentName, p.email, p.courseName,
      p.totalFees, p.paidAmount, p.remainingAmount,
      p.paymentMethod, p.transactionId || '',
      p.status, new Date(p.paymentDate).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total record{pagination.total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <Link
            to="/payment/create"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700"
          >
            <Plus className="h-4 w-4" /> Record Payment
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, receipt no, transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
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
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="">All Methods</option>
          {METHODS.map((m) => <option key={m} value={m} className="uppercase">{m.toUpperCase()}</option>)}
        </select>
        {(search || status || method) && (
          <button
            onClick={() => { setSearch(''); setStatus(''); setMethod(''); }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Receipt / Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Paid</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Due</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Method</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-slate-800 mx-auto" />
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-gray-400">
                    <p className="text-3xl mb-2">💳</p>
                    <p className="font-medium">No payments found</p>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs text-gray-400 mb-0.5">{p.receiptNumber}</p>
                      <p className="font-medium text-gray-900">{p.studentName}</p>
                      {p.email && <p className="text-xs text-gray-400">{p.email}</p>}
                    </td>
                    <td className="px-5 py-4 text-gray-700">{p.courseName || '—'}</td>
                    <td className="px-5 py-4 text-right font-medium text-gray-700">
                      ₹{p.totalFees?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-green-700">
                      ₹{p.paidAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-red-600">
                      ₹{p.remainingAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${METHOD_BADGE[p.paymentMethod] || 'bg-gray-100 text-gray-600'}`}>
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[p.status] || 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(p.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/payment/${p._id}`)}
                          title="View"
                          className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => navigate(`/payment/edit/${p._id}`)}
                            title="Edit"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleReceipt(p._id)}
                          disabled={downloading === p._id}
                          title="Download Receipt"
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-40"
                        >
                          <Receipt className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deleting === p._id}
                            title="Delete"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"
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
            <span className="text-gray-500">Page {pagination.page} of {pagination.pages}</span>
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
