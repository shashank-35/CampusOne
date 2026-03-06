import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import admissionService from '@/services/admissionService';
import api from '@/services/api';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errorCls = 'text-red-500 text-xs mt-1';

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-100">{title}</h3>
      {children}
    </section>
  );
}

function FileInput({ label, name, accept, preview, onChange, onClear }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {preview ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-sm text-gray-700 truncate flex-1">{preview}</span>
          <button type="button" onClick={onClear} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-3 px-3 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-slate-500 transition-colors">
          <Upload className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Click to upload {label}</span>
          <input type="file" accept={accept} className="hidden" onChange={onChange} />
        </label>
      )}
    </div>
  );
}

export default function AdmissionForm() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = Boolean(id);

  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [files, setFiles]         = useState({ photo: null, idProof: null, marksheet: null });
  const [existingDocs, setExistingDocs] = useState({});

  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      studentName: '', email: '', mobile: '', dateOfBirth: '', gender: '',
      courseId: '', courseName: '', admissionDate: new Date().toISOString().split('T')[0],
      batch: '', totalFees: '', discount: '0', paymentStatus: 'pending',
      status: 'pending', notes: '',
    },
  });

  const totalFees = watch('totalFees');
  const discount  = watch('discount');
  const finalFees = Math.max(0, Number(totalFees || 0) - Number(discount || 0));
  const courseId  = watch('courseId');

  // Load courses
  useEffect(() => {
    api.get('/courses').then((r) => setCourses(r.data.data || [])).catch(() => {});
  }, []);

  // Auto-fill courseName when courseId changes
  useEffect(() => {
    if (courseId) {
      const c = courses.find((c) => c._id === courseId);
      if (c) setValue('courseName', c.title);
    }
  }, [courseId, courses, setValue]);

  // Load existing admission for edit
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    admissionService
      .getById(id)
      .then((res) => {
        const a = res.data.data;
        reset({
          studentName:   a.studentName  || '',
          email:         a.email        || '',
          mobile:        a.mobile       || '',
          dateOfBirth:   a.dateOfBirth  ? a.dateOfBirth.split('T')[0] : '',
          gender:        a.gender       || '',
          courseId:      a.courseId?._id || a.courseId || '',
          courseName:    a.courseName   || '',
          admissionDate: a.admissionDate ? a.admissionDate.split('T')[0] : '',
          batch:         a.batch        || '',
          totalFees:     a.totalFees    ?? '',
          discount:      a.discount     ?? '0',
          paymentStatus: a.paymentStatus || 'pending',
          status:        a.status        || 'pending',
          notes:         a.notes         || '',
        });
        setExistingDocs(a.documents || {});
      })
      .catch(() => toast.error('Failed to load admission'))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (file) setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const clearFile = (field) => {
    setFiles((prev) => ({ ...prev, [field]: null }));
    setExistingDocs((prev) => ({ ...prev, [field]: null }));
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== '') formData.append(k, v); });

      if (files.photo)     formData.append('photo',     files.photo);
      if (files.idProof)   formData.append('idProof',   files.idProof);
      if (files.marksheet) formData.append('marksheet', files.marksheet);

      if (isEdit) {
        await admissionService.update(id, formData);
        toast.success('Admission updated successfully');
      } else {
        await admissionService.create(formData);
        toast.success('Admission created successfully');
      }
      navigate('/admission');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save admission');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4">
          <h2 className="text-white font-semibold text-lg">{isEdit ? 'Edit Admission' : 'New Admission'}</h2>
          <p className="text-slate-300 text-sm mt-0.5">
            {isEdit ? 'Update admission record' : 'Create a new admission record'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-8">
          {/* ── Student Details ── */}
          <Section title="Student Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                <input
                  {...register('studentName', { required: 'Student name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                  placeholder="Full name"
                  className={`${inputCls} ${errors.studentName ? 'border-red-400' : ''}`}
                />
                {errors.studentName && <p className={errorCls}>{errors.studentName.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                  })}
                  placeholder="email@example.com"
                  className={`${inputCls} ${errors.email ? 'border-red-400' : ''}`}
                />
                {errors.email && <p className={errorCls}>{errors.email.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Mobile <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  {...register('mobile', {
                    required: 'Mobile is required',
                    pattern: { value: /^\d{10}$/, message: 'Must be exactly 10 digits' },
                  })}
                  placeholder="10-digit number"
                  maxLength={10}
                  className={`${inputCls} ${errors.mobile ? 'border-red-400' : ''}`}
                />
                {errors.mobile && <p className={errorCls}>{errors.mobile.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Date of Birth</label>
                <input type="date" {...register('dateOfBirth')} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Gender</label>
                <select {...register('gender')} className={inputCls}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </Section>

          {/* ── Course & Batch ── */}
          <Section title="Course & Batch">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Select Course</label>
                <select {...register('courseId')} className={inputCls}>
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Course Name <span className="text-red-500">*</span></label>
                <input
                  {...register('courseName', { required: 'Course name is required' })}
                  placeholder="Course name"
                  className={`${inputCls} ${errors.courseName ? 'border-red-400' : ''}`}
                />
                {errors.courseName && <p className={errorCls}>{errors.courseName.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Batch</label>
                <input
                  {...register('batch')}
                  placeholder="e.g. Batch 2025-A"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Admission Date</label>
                <input type="date" {...register('admissionDate')} className={inputCls} />
              </div>
            </div>
          </Section>

          {/* ── Fee Details ── */}
          <Section title="Fee Details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Total Fees (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  {...register('totalFees', {
                    required: 'Total fees is required',
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                  placeholder="50000"
                  className={`${inputCls} ${errors.totalFees ? 'border-red-400' : ''}`}
                />
                {errors.totalFees && <p className={errorCls}>{errors.totalFees.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  {...register('discount')}
                  placeholder="0"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Final Fees (₹)</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900">
                  ₹{finalFees.toLocaleString()}
                </div>
              </div>

              <div>
                <label className={labelCls}>Payment Status</label>
                <select {...register('paymentStatus')} className={inputCls}>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Admission Status</label>
                <select {...register('status')} className={inputCls}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </Section>

          {/* ── Documents ── */}
          <Section title="Documents">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FileInput
                label="Photo"
                name="photo"
                accept="image/jpg,image/jpeg,image/png"
                preview={files.photo?.name || (existingDocs.photo ? 'Uploaded photo' : null)}
                onChange={handleFileChange('photo')}
                onClear={() => clearFile('photo')}
              />
              <FileInput
                label="ID Proof"
                name="idProof"
                accept=".pdf,.doc,.docx,image/jpg,image/png"
                preview={files.idProof?.name || (existingDocs.idProof ? 'Uploaded ID proof' : null)}
                onChange={handleFileChange('idProof')}
                onClear={() => clearFile('idProof')}
              />
              <FileInput
                label="Marksheet"
                name="marksheet"
                accept=".pdf,.doc,.docx,image/jpg,image/png"
                preview={files.marksheet?.name || (existingDocs.marksheet ? 'Uploaded marksheet' : null)}
                onChange={handleFileChange('marksheet')}
                onClear={() => clearFile('marksheet')}
              />
            </div>
          </Section>

          {/* ── Notes ── */}
          <Section title="Notes">
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Additional notes about this admission..."
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
              {saving ? 'Saving...' : isEdit ? 'Update Admission' : 'Create Admission'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admission')}
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
