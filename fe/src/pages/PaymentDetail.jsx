import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import toast from 'react-hot-toast';
import { ArrowLeft, Pencil, Receipt, Download } from 'lucide-react';
import paymentService from '@/services/paymentService';
import { useAuth } from '@/context/AuthContext';

const STATUS_CFG = {
  pending: { cls: 'bg-orange-100 text-orange-700 border border-orange-200', label: 'Pending' },
  partial: { cls: 'bg-blue-100 text-blue-700 border border-blue-200',       label: 'Partial'  },
  paid:    { cls: 'bg-green-100 text-green-700 border border-green-200',    label: 'Paid'     },
};

const METHOD_LABELS = { cash: 'Cash', upi: 'UPI', card: 'Card', bank: 'Bank Transfer' };

function Row({ label, value, mono }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div>
      <dt className="text-xs text-gray-400 mb-0.5">{label}</dt>
      <dd className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  );
}

export default function PaymentDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [payment, setPayment]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [downloading, setDl]      = useState(false);

  const isAdmin  = user?.role === 'admin';
  const canEdit  = isAdmin || user?.role === 'counselor';

  useEffect(() => {
    paymentService.getById(id)
      .then((r) => setPayment(r.data.data))
      .catch(() => { toast.error('Payment not found'); navigate('/payment'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleReceipt = async () => {
    setDl(true);
    try {
      await paymentService.downloadReceipt(id);
      toast.success('Receipt downloaded');
    } catch {
      toast.error('Failed to generate receipt');
    } finally {
      setDl(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
      </div>
    );
  }
  if (!payment) return null;

  const statusCfg = STATUS_CFG[payment.status] || STATUS_CFG.pending;
  const studentName = payment.studentId
    ? `${payment.studentId.firstName} ${payment.studentId.lastName}`
    : payment.studentName;

  const paidPct = payment.totalFees > 0
    ? Math.min(100, Math.round((payment.paidAmount / payment.totalFees) * 100))
    : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/payment')} className="flex items-center gap-1 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Payments
        </button>
        <span>/</span>
        <span className="text-gray-800 font-mono text-xs">{payment.receiptNumber}</span>
      </div>

      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{studentName}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusCfg.cls}`}>
                {statusCfg.label}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{payment.email}</p>
            <p className="font-mono text-xs text-gray-400 mt-1">{payment.receiptNumber}</p>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {canEdit && (
              <Link
                to={`/payment/edit/${id}`}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Link>
            )}
            <button
              onClick={handleReceipt}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-60"
            >
              {downloading
                ? <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Generating...</>
                : <><Receipt className="h-4 w-4" /> Download Receipt</>
              }
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Student Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Student Information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <Row label="Full Name"  value={studentName} />
              <Row label="Email"      value={payment.email} />
              <Row label="Mobile"     value={payment.mobile} />
              <Row label="Course"     value={payment.courseName} />
              {payment.admissionId?.batch && (
                <Row label="Batch" value={payment.admissionId.batch} />
              )}
            </dl>
          </div>

          {/* Payment Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Payment Information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <Row label="Payment Method"
                value={METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod} />
              <Row label="Payment Date"
                value={new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })} />
              <Row label="Transaction ID" value={payment.transactionId} mono />
              <Row label="Recorded By"
                value={payment.createdBy
                  ? `${payment.createdBy.firstName} ${payment.createdBy.lastName}`
                  : null} />
            </dl>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Notes</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{payment.notes}</p>
            </div>
          )}
        </div>

        {/* Right — fee summary */}
        <div className="space-y-5">
          {/* Fee breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Fee Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total Fees</span>
                <span className="font-semibold text-gray-900">
                  ₹{payment.totalFees?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Amount Paid</span>
                <span className="font-semibold">₹{payment.paidAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Remaining</span>
                <span className="font-semibold">₹{payment.remainingAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Collection progress</span>
                <span>{paidPct}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    paidPct >= 100 ? 'bg-green-500' : paidPct > 0 ? 'bg-blue-500' : 'bg-orange-400'
                  }`}
                  style={{ width: `${paidPct}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusCfg.cls}`}>
                {statusCfg.label}
              </span>
            </div>
          </div>

          {/* Receipt download card */}
          <div className="bg-slate-800 rounded-xl p-5 text-center">
            <Receipt className="h-8 w-8 text-slate-300 mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">Fee Receipt</p>
            <p className="text-slate-400 text-xs mb-4">Download official PDF receipt</p>
            <button
              onClick={handleReceipt}
              disabled={downloading}
              className="w-full py-2.5 bg-white text-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {downloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>

          {/* Source admission link */}
          {payment.admissionId && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Linked Admission</h2>
              <Link
                to={`/admission/${payment.admissionId._id || payment.admissionId}`}
                className="text-sm text-slate-800 font-medium hover:underline"
              >
                View Admission Record →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
