import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import toast from 'react-hot-toast';
import { Pencil, ArrowLeft, FileText, Image } from 'lucide-react';
import admissionService from '@/services/admissionService';
import { useAuth } from '@/context/AuthContext';

const STATUS_BADGE = {
  pending:  'bg-yellow-100 text-yellow-700 border border-yellow-200',
  approved: 'bg-green-100 text-green-700 border border-green-200',
  rejected: 'bg-red-100 text-red-700 border border-red-200',
};

const PAYMENT_BADGE = {
  pending: 'bg-orange-100 text-orange-700',
  partial: 'bg-blue-100 text-blue-700',
  paid:    'bg-green-100 text-green-700',
};

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-gray-400 mb-0.5">{label}</dt>
      <dd className="text-sm font-medium text-gray-800">{value}</dd>
    </div>
  );
}

function DocLink({ label, path, icon: Icon }) {
  if (!path) return null;
  const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(path);

  return (
    <a
      href={`${BASE}${path}`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm text-gray-700"
    >
      <Icon className="h-4 w-4 text-gray-400" />
      <span>{label}</span>
      <span className="ml-auto text-xs text-gray-400 capitalize">{isImage ? 'View' : 'Download'}</span>
    </a>
  );
}

export default function AdmissionDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading]     = useState(true);
  const isAdmin    = user?.role === 'admin';
  const canEdit    = isAdmin || user?.role === 'counselor';

  useEffect(() => {
    admissionService
      .getById(id)
      .then((res) => setAdmission(res.data.data))
      .catch(() => { toast.error('Failed to load admission'); navigate('/admission'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
      </div>
    );
  }

  if (!admission) return null;

  const docs = admission.documents || {};
  const hasDocs = docs.photo || docs.idProof || docs.marksheet;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/admission')} className="flex items-center gap-1 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Admissions
        </button>
        <span>/</span>
        <span className="text-gray-800 font-medium">{admission.studentName}</span>
      </div>

      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{admission.studentName}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${STATUS_BADGE[admission.status] || 'bg-gray-100 text-gray-600'}`}>
                {admission.status}
              </span>
            </div>
            <p className="text-gray-500 mt-1">{admission.email}</p>
            <p className="text-gray-500 text-sm">{admission.mobile}</p>
          </div>

          {canEdit && (
            <Link
              to={`/admission/edit/${id}`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              <Pencil className="h-4 w-4" /> Edit
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — main details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Student Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Student Information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <InfoRow label="Full Name"    value={admission.studentName} />
              <InfoRow label="Email"        value={admission.email} />
              <InfoRow label="Mobile"       value={admission.mobile} />
              <InfoRow label="Gender"       value={admission.gender} />
              <InfoRow
                label="Date of Birth"
                value={admission.dateOfBirth
                  ? new Date(admission.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                  : null}
              />
            </dl>
          </div>

          {/* Course Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Course & Batch</h2>
            <dl className="grid grid-cols-2 gap-4">
              <InfoRow label="Course Name"     value={admission.courseName} />
              <InfoRow label="Batch"           value={admission.batch} />
              <InfoRow
                label="Admission Date"
                value={admission.admissionDate
                  ? new Date(admission.admissionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                  : null}
              />
              <InfoRow label="Created By"
                value={admission.createdBy ? `${admission.createdBy.firstName} ${admission.createdBy.lastName}` : null}
              />
            </dl>
          </div>

          {/* Notes */}
          {admission.notes && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Notes</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{admission.notes}</p>
            </div>
          )}
        </div>

        {/* Right — fees + docs */}
        <div className="space-y-5">
          {/* Fee Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Fee Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total Fees</span>
                <span className="font-medium">₹{admission.totalFees?.toLocaleString()}</span>
              </div>
              {admission.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{admission.discount?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2 text-base">
                <span>Final Fees</span>
                <span>₹{(admission.finalFees ?? admission.totalFees)?.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1.5">Payment Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${PAYMENT_BADGE[admission.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                {admission.paymentStatus}
              </span>
            </div>
          </div>

          {/* Documents */}
          {hasDocs && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Documents</h2>
              <div className="space-y-2">
                <DocLink label="Photo"     path={docs.photo}     icon={Image} />
                <DocLink label="ID Proof"  path={docs.idProof}   icon={FileText} />
                <DocLink label="Marksheet" path={docs.marksheet} icon={FileText} />
              </div>
            </div>
          )}

          {/* Source inquiry */}
          {admission.inquiryId && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Source</h2>
              <p className="text-xs text-gray-500 mb-1">Converted from inquiry</p>
              <Link
                to={`/inquiry/edit/${typeof admission.inquiryId === 'object' ? admission.inquiryId._id : admission.inquiryId}`}
                className="text-sm text-slate-800 font-medium hover:underline"
              >
                View Inquiry →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
