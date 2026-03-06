import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import paymentService from '@/services/paymentService';
import api from '@/services/api';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errCls   = 'text-red-500 text-xs mt-1';

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-100">{title}</h3>
      {children}
    </section>
  );
}

export default function PaymentForm() {
  const { id }           = useParams();
  const navigate         = useNavigate();
  const [searchParams]   = useSearchParams();
  const isEdit           = Boolean(id);

  const [admissions, setAdmissions] = useState([]);
  const [loadingAdm, setLoadingAdm] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [fetchingAdm, setFetchingAdm] = useState(false);

  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      admissionId:   '',
      studentName:   '',
      courseName:    '',
      email:         '',
      mobile:        '',
      totalFees:     '',
      paidAmount:    '',
      paymentMethod: 'cash',
      transactionId: '',
      paymentDate:   new Date().toISOString().split('T')[0],
      notes:         '',
    },
  });

  const totalFees  = Number(watch('totalFees')  || 0);
  const paidAmount = Number(watch('paidAmount') || 0);
  const remaining  = Math.max(0, totalFees - paidAmount);
  const autoStatus = paidAmount <= 0 ? 'pending' : paidAmount >= totalFees ? 'paid' : 'partial';
  const admissionId = watch('admissionId');

  // Load admissions for dropdown
  useEffect(() => {
    setLoadingAdm(true);
    api.get('/admissions', { params: { limit: 200, status: 'approved' } })
      .then((r) => setAdmissions(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingAdm(false));
  }, []);

  // Pre-fill from admissionId query param (coming from Admission Detail)
  useEffect(() => {
    const fromAdm = searchParams.get('admissionId');
    if (fromAdm && !isEdit) setValue('admissionId', fromAdm);
  }, [searchParams, isEdit, setValue]);

  // Auto-fill fields when admissionId changes
  useEffect(() => {
    if (!admissionId || isEdit) return;
    const adm = admissions.find((a) => a._id === admissionId);
    if (adm) {
      setFetchingAdm(true);
      api.get(`/admissions/${admissionId}`)
        .then((r) => {
          const a = r.data.data;
          setValue('studentName', a.studentName || '');
          setValue('courseName',  a.courseName  || '');
          setValue('email',       a.email       || '');
          setValue('mobile',      a.mobile      || '');
          setValue('totalFees',   String(a.finalFees ?? a.totalFees ?? ''));
        })
        .catch(() => {})
        .finally(() => setFetchingAdm(false));
    }
  }, [admissionId, admissions, isEdit, setValue]);

  // Load existing payment for edit
  useEffect(() => {
    if (!isEdit) return;
    paymentService.getById(id)
      .then((r) => {
        const p = r.data.data;
        reset({
          admissionId:   p.admissionId?._id || p.admissionId || '',
          studentName:   p.studentName   || '',
          courseName:    p.courseName    || '',
          email:         p.email         || '',
          mobile:        p.mobile        || '',
          totalFees:     String(p.totalFees   ?? ''),
          paidAmount:    String(p.paidAmount  ?? ''),
          paymentMethod: p.paymentMethod || 'cash',
          transactionId: p.transactionId || '',
          paymentDate:   p.paymentDate ? p.paymentDate.split('T')[0] : '',
          notes:         p.notes || '',
        });
      })
      .catch(() => toast.error('Failed to load payment'));
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    if (Number(data.paidAmount) > Number(data.totalFees)) {
      toast.error('Paid amount cannot exceed total fees');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...data,
        totalFees:  Number(data.totalFees),
        paidAmount: Number(data.paidAmount),
      };
      if (!payload.admissionId) delete payload.admissionId;

      if (isEdit) {
        await paymentService.update(id, payload);
        toast.success('Payment updated successfully');
      } else {
        await paymentService.create(payload);
        toast.success('Payment recorded successfully');
      }
      navigate('/payment');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save payment');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = {
    pending: 'bg-orange-100 text-orange-700',
    partial: 'bg-blue-100 text-blue-700',
    paid:    'bg-green-100 text-green-700',
  }[autoStatus];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-3xl bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4">
          <h2 className="text-white font-semibold text-lg">{isEdit ? 'Edit Payment' : 'Record Payment'}</h2>
          <p className="text-slate-300 text-sm mt-0.5">
            {isEdit ? 'Update payment record' : 'Record a fee payment for a student'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-8">

          {/* ── Link to Admission ── */}
          <Section title="Link to Admission (Optional)">
            <div>
              <label className={labelCls}>Select Admission</label>
              <select
                {...register('admissionId')}
                disabled={loadingAdm || isEdit}
                className={`${inputCls} disabled:bg-gray-50`}
              >
                <option value="">— Manual entry —</option>
                {admissions.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.studentName} · {a.courseName} {a.batch ? `(${a.batch})` : ''}
                  </option>
                ))}
              </select>
              {fetchingAdm && (
                <p className="text-xs text-slate-500 mt-1">Loading admission details...</p>
              )}
            </div>
          </Section>

          {/* ── Student Details ── */}
          <Section title="Student Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Student Name <span className="text-red-500">*</span></label>
                <input
                  {...register('studentName', { required: 'Student name is required' })}
                  placeholder="Full name"
                  className={`${inputCls} ${errors.studentName ? 'border-red-400' : ''}`}
                />
                {errors.studentName && <p className={errCls}>{errors.studentName.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Course Name</label>
                <input
                  {...register('courseName')}
                  placeholder="Course name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="student@example.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Mobile</label>
                <input
                  type="tel"
                  {...register('mobile')}
                  placeholder="10-digit number"
                  className={inputCls}
                />
              </div>
            </div>
          </Section>

          {/* ── Fee Details ── */}
          <Section title="Fee Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Total Fees (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number" min="0"
                  {...register('totalFees', {
                    required: 'Total fees is required',
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                  placeholder="50000"
                  className={`${inputCls} ${errors.totalFees ? 'border-red-400' : ''}`}
                />
                {errors.totalFees && <p className={errCls}>{errors.totalFees.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Amount Paid (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number" min="0"
                  {...register('paidAmount', {
                    required: 'Paid amount is required',
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                  placeholder="0"
                  className={`${inputCls} ${errors.paidAmount ? 'border-red-400' : ''}`}
                />
                {errors.paidAmount && <p className={errCls}>{errors.paidAmount.message}</p>}
              </div>
            </div>

            {/* Live fee summary */}
            {(totalFees > 0 || paidAmount > 0) && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total Fees</p>
                  <p className="text-lg font-bold text-gray-900">₹{totalFees.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Amount Paid</p>
                  <p className="text-lg font-bold text-green-600">₹{paidAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Remaining</p>
                  <p className="text-lg font-bold text-red-600">₹{remaining.toLocaleString('en-IN')}</p>
                </div>
                <div className="col-span-3 pt-2 border-t border-gray-200">
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold capitalize ${statusColor}`}>
                    Status: {autoStatus}
                  </span>
                </div>
              </div>
            )}
          </Section>

          {/* ── Payment Info ── */}
          <Section title="Payment Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Payment Method <span className="text-red-500">*</span></label>
                <select
                  {...register('paymentMethod', { required: 'Payment method is required' })}
                  className={`${inputCls} ${errors.paymentMethod ? 'border-red-400' : ''}`}
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
                {errors.paymentMethod && <p className={errCls}>{errors.paymentMethod.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Payment Date</label>
                <input
                  type="date"
                  {...register('paymentDate')}
                  className={inputCls}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls}>Transaction ID / Reference</label>
                <input
                  {...register('transactionId')}
                  placeholder="UPI ref / cheque no / bank ref..."
                  className={inputCls}
                />
              </div>
            </div>
          </Section>

          {/* ── Notes ── */}
          <Section title="Notes">
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Additional notes..."
              className={`${inputCls} resize-none`}
            />
          </Section>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Payment' : 'Record Payment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/payment')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
