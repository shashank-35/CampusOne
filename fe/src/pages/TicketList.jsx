import { useEffect, useState, useCallback } from 'react';
import { Ticket, ChevronDown, ChevronUp, Send, User, Clock, RefreshCw } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  open:          'bg-blue-100 text-blue-700',
  'in-progress': 'bg-orange-100 text-orange-700',
  resolved:      'bg-green-100 text-green-700',
  closed:        'bg-gray-100 text-gray-600',
};

const CATEGORY_LABELS = {
  admission: 'Admission',
  fees:      'Fees & Payment',
  course:    'Course Info',
  technical: 'Technical',
  other:     'Other',
};

const STATUSES = ['open', 'in-progress', 'resolved', 'closed'];

function TicketRow({ ticket, counselors, onUpdated }) {
  const [open, setOpen]       = useState(false);
  const [status, setStatus]   = useState(ticket.status);
  const [assigned, setAssigned] = useState(ticket.assignedTo?._id || '');
  const [reply, setReply]     = useState('');
  const [saving, setSaving]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { status };
      if (assigned !== (ticket.assignedTo?._id || '')) payload.assignedTo = assigned;
      if (reply.trim()) payload.reply = reply.trim();

      await api.put(`/tickets/${ticket._id}`, payload);
      toast.success('Ticket updated');
      setReply('');
      onUpdated();
    } catch {
      toast.error('Failed to update ticket');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Row header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[ticket.status]}`}>
              {ticket.status}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {CATEGORY_LABELS[ticket.category] || ticket.category}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900 mt-1 truncate">{ticket.subject}</p>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {ticket.student?.firstName} {ticket.student?.lastName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
            {ticket.assignedTo && (
              <span>Assigned: {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}</span>
            )}
          </div>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-gray-50/50">
          {/* Student message */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Message</p>
            <p className="text-sm text-gray-700 bg-white border border-gray-100 rounded-lg p-3 leading-relaxed">
              {ticket.message}
            </p>
          </div>

          {/* Existing reply */}
          {ticket.reply && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Reply by {ticket.repliedBy?.firstName} {ticket.repliedBy?.lastName}
                <span className="ml-2 font-normal normal-case">
                  · {new Date(ticket.repliedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </p>
              <p className="text-sm text-gray-700 bg-indigo-50 border border-indigo-100 rounded-lg p-3 leading-relaxed">
                {ticket.reply}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Assign To</label>
              <select
                value={assigned}
                onChange={(e) => setAssigned(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Unassigned</option>
                {counselors.map((c) => (
                  <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {ticket.reply ? 'Update Reply' : 'Write a Reply'}
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Type your reply to the student..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {saving
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                : <><Send className="h-4 w-4" /> Save</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TicketList() {
  const { user } = useAuth();
  const [tickets, setTickets]       = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const res = await api.get(`/tickets${params}`);
      setTickets(res.data.data || []);
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTickets();
    // Admin fetches counselors for the assign dropdown
    if (user?.role === 'admin') {
      api.get('/users?role=counselor&limit=100')
        .then((res) => setCounselors(res.data.data?.users || res.data.data || []))
        .catch(() => {});
    }
  }, [fetchTickets, user]);

  const counts = tickets.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="h-5 w-5 text-indigo-600" />
            Support Tickets
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{tickets.length} total tickets</p>
        </div>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Open',        key: 'open',          color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'In Progress', key: 'in-progress',   color: 'text-orange-600 bg-orange-50 border-orange-100' },
          { label: 'Resolved',    key: 'resolved',      color: 'text-green-600 bg-green-50 border-green-100' },
          { label: 'Closed',      key: 'closed',        color: 'text-gray-600 bg-gray-50 border-gray-100' },
        ].map(({ label, key, color }) => (
          <div key={key} className={`rounded-xl border p-4 ${color}`}>
            <p className="text-2xl font-bold">{counts[key] || 0}</p>
            <p className="text-xs font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['', 'open', 'in-progress', 'resolved', 'closed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              statusFilter === s
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-gray-100 animate-pulse" />
          ))
        ) : tickets.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-gray-100">
            <Ticket className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No tickets found</p>
          </div>
        ) : (
          tickets.map((t) => (
            <TicketRow
              key={t._id}
              ticket={t}
              counselors={counselors}
              onUpdated={fetchTickets}
            />
          ))
        )}
      </div>
    </div>
  );
}
