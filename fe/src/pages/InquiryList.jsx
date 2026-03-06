import { useEffect, useState, useCallback } from 'react';
import {
  Search, Plus, Download, Phone, Mail, Trash2, Edit, Eye,
  UserCheck, StickyNote, ArrowRightCircle, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import inquiryService from '@/services/inquiryService';
import admissionService from '@/services/admissionService';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const STATUSES = ['new', 'contacted', 'interested', 'admission-done', 'not-interested', 'closed'];
const SOURCES  = ['website', 'reference', 'social', 'walk-in', 'qr-code'];

const STATUS_STYLES = {
  new:              'bg-blue-100 text-blue-700',
  contacted:        'bg-orange-100 text-orange-700',
  interested:       'bg-purple-100 text-purple-700',
  'admission-done': 'bg-green-100 text-green-700',
  'not-interested': 'bg-red-100 text-red-700',
  closed:           'bg-gray-100 text-gray-700',
};

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'}`}>
    {status?.replace('-', ' ')}
  </span>
);

export default function InquiryList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const isReceptionist = user?.role === 'receptionist';
  const isCounselor = user?.role === 'counselor';

  const [inquiries, setInquiries]         = useState([]);
  const [loading, setLoading]             = useState(false);
  const [pagination, setPagination]       = useState({});
  const [page, setPage]                   = useState(1);
  const [search, setSearch]               = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [sourceFilter, setSourceFilter]   = useState('');

  // Dialogs
  const [viewOpen, setViewOpen]           = useState(false);
  const [selected, setSelected]           = useState(null);
  const [assignOpen, setAssignOpen]       = useState(false);
  const [assignTarget, setAssignTarget]   = useState(null);
  const [counselors, setCounselors]       = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [noteOpen, setNoteOpen]           = useState(false);
  const [noteTarget, setNoteTarget]       = useState(null);
  const [noteText, setNoteText]           = useState('');

  // Convert to Admission dialog
  const [admOpen, setAdmOpen]             = useState(false);
  const [admTarget, setAdmTarget]         = useState(null);
  const [admCourses, setAdmCourses]       = useState([]);
  const [admForm, setAdmForm]             = useState({ courseId: '', courseName: '', batch: '', totalFees: '', discount: '0', paymentStatus: 'pending' });

  const fetchInquiries = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 10, search, status: statusFilter, sourceOfInquiry: sourceFilter };
      const res = await inquiryService.getAll(params);
      setInquiries(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, sourceFilter]);

  useEffect(() => { fetchInquiries(1); setPage(1); }, [search, statusFilter, sourceFilter]);
  useEffect(() => { fetchInquiries(page); }, [page]);

  // Fetch counselors for assign dialog
  const openAssign = async (inquiry) => {
    setAssignTarget(inquiry);
    setSelectedCounselor('');
    try {
      const res = await api.get('/users/counselors');
      setCounselors(res.data.data || []);
    } catch { setCounselors([]); }
    setAssignOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedCounselor) { toast.error('Select a counselor'); return; }
    try {
      await inquiryService.assign(assignTarget._id, selectedCounselor);
      toast.success('Inquiry assigned successfully');
      setAssignOpen(false);
      fetchInquiries(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assign failed');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) { toast.error('Enter a note'); return; }
    try {
      await inquiryService.addNote(noteTarget._id, noteText.trim());
      toast.success('Note added');
      setNoteOpen(false);
      setNoteText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add note');
    }
  };

  const handleConvert = async (id) => {
    if (!confirm('Convert this inquiry to a student record?')) return;
    try {
      await inquiryService.convert(id);
      toast.success('Converted to student successfully!');
      fetchInquiries(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Conversion failed');
    }
  };

  const openConvertAdmission = async (inq) => {
    setAdmTarget(inq);
    setAdmForm({ courseId: '', courseName: '', batch: '', totalFees: '', discount: '0', paymentStatus: 'pending' });
    try {
      const res = await api.get('/courses', { params: { limit: 100 } });
      setAdmCourses(res.data.data || []);
    } catch { setAdmCourses([]); }
    setAdmOpen(true);
  };

  const handleConvertAdmission = async () => {
    if (!admForm.totalFees) { toast.error('Total fees is required'); return; }
    if (!admForm.courseName && !admForm.courseId) { toast.error('Course name is required'); return; }
    try {
      const formData = new FormData();
      Object.entries(admForm).forEach(([k, v]) => { if (v) formData.append(k, v); });
      // Auto-fill courseName from selected course
      if (admForm.courseId && !admForm.courseName) {
        const c = admCourses.find((c) => c._id === admForm.courseId);
        if (c) formData.set('courseName', c.title);
      }
      await admissionService.convertFromInquiry(admTarget._id, formData);
      toast.success('Inquiry converted to admission!');
      setAdmOpen(false);
      fetchInquiries(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Conversion failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await inquiryService.delete(id);
      toast.success('Inquiry deleted');
      fetchInquiries(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Mobile', 'Source', 'Status', 'Interested Area', 'Date'];
    const rows = inquiries.map((i) => [
      `${i.firstName} ${i.lastName}`,
      i.email, i.mobile,
      i.sourceOfInquiry, i.status, i.interestedArea,
      new Date(i.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'inquiries.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-sm text-gray-500">Track and manage student admission inquiries.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportCSV} className="hidden sm:flex bg-white">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          {!isCounselor && (
            <Link to="/inquiry/create">
              <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Inquiry
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, mobile..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.replace('-', ' ')}</option>)}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="">All Sources</option>
          {SOURCES.map((s) => <option key={s} value={s} className="capitalize">{s.replace('-', ' ')}</option>)}
        </select>
        {(statusFilter || sourceFilter || search) && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => { setSearch(''); setStatusFilter(''); setSourceFilter(''); }}
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="p-4">NAME</th>
                <th className="p-4">CONTACT</th>
                <th className="p-4">SOURCE</th>
                <th className="p-4">INTERESTED AREA</th>
                <th className="p-4">ASSIGNED TO</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-400">Loading...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-400">No inquiries found.</td></tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{inq.firstName} {inq.lastName}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        {inq.mobile && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{inq.mobile}</span>}
                        {inq.email  && <span className="flex items-center gap-1"><Mail  className="h-3 w-3" />{inq.email}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 capitalize text-xs">{inq.sourceOfInquiry?.replace('-', ' ')}</td>
                    <td className="p-4 text-gray-600 text-xs">{inq.interestedArea || '—'}</td>
                    <td className="p-4 text-xs text-gray-600">
                      {inq.assignedTo ? `${inq.assignedTo.firstName} ${inq.assignedTo.lastName}` : <span className="text-gray-400">Unassigned</span>}
                    </td>
                    <td className="p-4"><StatusBadge status={inq.status} /></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-blue-600" onClick={() => { setSelected(inq); setViewOpen(true); }} title="View">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {!isCounselor && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-green-600" onClick={() => navigate(`/inquiry/edit/${inq._id}`)} title="Edit">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {(isAdmin || isReceptionist) && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-purple-600" onClick={() => openAssign(inq)} title="Assign">
                            <UserCheck className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-yellow-600" onClick={() => { setNoteTarget(inq); setNoteOpen(true); }} title="Add Note">
                          <StickyNote className="h-3.5 w-3.5" />
                        </Button>
                        {(isAdmin || isCounselor) && inq.status !== 'admission-done' && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-emerald-600" onClick={() => openConvertAdmission(inq)} title="Convert to Admission">
                            <ArrowRightCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {(isAdmin || isCounselor) && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-red-600" onClick={() => handleDelete(inq._id)} title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <div>Showing {inquiries.length} of {pagination.total || 0} inquiries</div>
          {pagination.pages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>Page {page} of {pagination.pages}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.pages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>Full information for this inquiry</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{selected.firstName} {selected.lastName}</p>
                  <p className="text-gray-500">{selected.email}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100">
                {[
                  ['Mobile', selected.mobile],
                  ['Source', selected.sourceOfInquiry],
                  ['Interested Area', selected.interestedArea],
                  ['Background', selected.techBackground],
                  ['Qualification', selected.qualification],
                  ['Passing Year', selected.passingYear],
                  ['City', selected.city],
                  ['State', selected.state],
                  ['Assigned To', selected.assignedTo ? `${selected.assignedTo.firstName} ${selected.assignedTo.lastName}` : 'Unassigned'],
                  ['Date', new Date(selected.createdAt).toLocaleDateString()],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-gray-400 uppercase font-medium">{k}</p>
                    <p className="text-gray-800 capitalize">{v || '—'}</p>
                  </div>
                ))}
              </div>
              {selected.convertedStudent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-xs font-medium">
                  Converted to Student
                </div>
              )}
              <div className="flex gap-2">
                {!isCounselor && (
                  <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs" onClick={() => { setViewOpen(false); navigate(`/inquiry/edit/${selected._id}`); }}>
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                )}
                <Button variant="outline" className="flex-1 text-xs" onClick={() => setViewOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign to Counselor</DialogTitle>
            <DialogDescription>Select a counselor for {assignTarget?.firstName} {assignTarget?.lastName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <select
              value={selectedCounselor}
              onChange={(e) => setSelectedCounselor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
            >
              <option value="">Select counselor...</option>
              {counselors.map((c) => (
                <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm" onClick={handleAssign}>Assign</Button>
              <Button variant="outline" className="flex-1 text-sm" onClick={() => setAssignOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>Add a follow-up note for {noteTarget?.firstName} {noteTarget?.lastName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
              placeholder="Enter your note..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 resize-none"
            />
            <div className="flex gap-2">
              <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm" onClick={handleAddNote}>Add Note</Button>
              <Button variant="outline" className="flex-1 text-sm" onClick={() => { setNoteOpen(false); setNoteText(''); }}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Convert to Admission Dialog */}
      <Dialog open={admOpen} onOpenChange={setAdmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Convert to Admission</DialogTitle>
            <DialogDescription>
              Create an admission record for {admTarget?.firstName} {admTarget?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Select Course</label>
              <select
                value={admForm.courseId}
                onChange={(e) => {
                  const c = admCourses.find((c) => c._id === e.target.value);
                  setAdmForm((p) => ({ ...p, courseId: e.target.value, courseName: c?.title || p.courseName }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              >
                <option value="">Select a course</option>
                {admCourses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Course Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={admForm.courseName}
                onChange={(e) => setAdmForm((p) => ({ ...p, courseName: e.target.value }))}
                placeholder="Course name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Batch</label>
                <input
                  type="text"
                  value={admForm.batch}
                  onChange={(e) => setAdmForm((p) => ({ ...p, batch: e.target.value }))}
                  placeholder="e.g. 2025-A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={admForm.paymentStatus}
                  onChange={(e) => setAdmForm((p) => ({ ...p, paymentStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Total Fees (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number" min="0"
                  value={admForm.totalFees}
                  onChange={(e) => setAdmForm((p) => ({ ...p, totalFees: e.target.value }))}
                  placeholder="50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Discount (₹)</label>
                <input
                  type="number" min="0"
                  value={admForm.discount}
                  onChange={(e) => setAdmForm((p) => ({ ...p, discount: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>
            </div>
            {admForm.totalFees && (
              <div className="bg-gray-50 px-3 py-2 rounded-md text-xs text-gray-600">
                Final Fees: <span className="font-bold text-gray-900">
                  ₹{Math.max(0, Number(admForm.totalFees) - Number(admForm.discount || 0)).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm" onClick={handleConvertAdmission}>
                Create Admission
              </Button>
              <Button variant="outline" className="flex-1 text-sm" onClick={() => setAdmOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
