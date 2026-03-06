import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import inquiryService from '@/services/inquiryService';
import { useAuth } from '@/context/AuthContext';

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

const STATUSES = ['new', 'contacted', 'interested', 'admission-done', 'not-interested', 'closed'];
const SOURCES = ['website', 'reference', 'social', 'walk-in', 'qr-code'];

// ⚠️ CRITICAL: Section MUST be defined outside InquiryForm.
// Defining it inside causes React to treat it as a NEW component type on every
// render, unmounting/remounting all child inputs → inputs lose focus on each keystroke.
function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-100">
        {title}
      </h3>
      {children}
    </section>
  );
}

const INITIAL_FORM = {
  sourceOfInquiry: '',
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  gender: 'male',
  mobile: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  techBackground: '',
  qualification: '',
  specialization: '',
  passingYear: '',
  interestedArea: '',
  status: 'new',
  followUpDate: '',
};

export default function InquiryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);
  const isCounselor = user?.role === 'counselor';

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---- load data for edit mode ----
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    inquiryService
      .getById(id)
      .then((res) => {
        const s = res.data.data;
        setForm({
          sourceOfInquiry: s.sourceOfInquiry || '',
          firstName: s.firstName || '',
          lastName: s.lastName || '',
          email: s.email || '',
          dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split('T')[0] : '',
          gender: s.gender || 'male',
          mobile: s.mobile || '',
          addressLine1: s.addressLine1 || '',
          addressLine2: s.addressLine2 || '',
          city: s.city || '',
          state: s.state || '',
          pincode: s.pincode || '',
          techBackground: s.techBackground || '',
          qualification: s.qualification || '',
          specialization: s.specialization || '',
          passingYear: s.passingYear || '',
          interestedArea: s.interestedArea || '',
          status: s.status || 'new',
          followUpDate: s.followUpDate ? s.followUpDate.split('T')[0] : '',
        });
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || 'Failed to load inquiry')
      )
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // ---- generic field setter ----
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // clear per-field error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ---- client-side validation ----
  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    else if (form.firstName.trim().length < 2) errs.firstName = 'Min 2 characters';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    else if (form.lastName.trim().length < 2) errs.lastName = 'Min 2 characters';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = 'Invalid email address';
    if (form.mobile && !/^\d{10}$/.test(form.mobile))
      errs.mobile = 'Mobile must be exactly 10 digits';
    if (form.pincode && !/^\d{6}$/.test(form.pincode))
      errs.pincode = 'Pincode must be 6 digits';
    return errs;
  };

  // ---- submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error('Please fix the highlighted errors');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await inquiryService.update(id, form);
        toast.success('Inquiry updated successfully');
      } else {
        await inquiryService.create(form);
        toast.success('Inquiry created successfully');
      }
      navigate('/inquiry');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save inquiry';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ---- error helper ----
  const Err = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4">
          <h2 className="text-white font-semibold text-lg">
            {isEdit ? 'Edit Inquiry' : 'New Inquiry'}
          </h2>
          <p className="text-slate-300 text-sm mt-0.5">
            {isEdit ? 'Update inquiry information' : 'Create a new student inquiry'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8" noValidate>
          {/* ── Inquiry Info ── */}
          <Section title="Inquiry Info">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Source of Inquiry</label>
                <select
                  value={form.sourceOfInquiry}
                  onChange={handleChange('sourceOfInquiry')}
                  className={inputCls}
                >
                  <option value="">Select source</option>
                  {SOURCES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={form.status}
                  onChange={handleChange('status')}
                  className={inputCls}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Follow-Up Date</label>
                <input
                  type="date"
                  value={form.followUpDate}
                  onChange={handleChange('followUpDate')}
                  className={inputCls}
                />
              </div>
            </div>
          </Section>

          {/* ── Personal Information ── */}
          <Section title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  placeholder="Enter first name"
                  className={`${inputCls} ${errors.firstName ? 'border-red-400' : ''}`}
                  autoComplete="given-name"
                />
                <Err field="firstName" />
              </div>

              <div>
                <label className={labelCls}>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  placeholder="Enter last name"
                  className={`${inputCls} ${errors.lastName ? 'border-red-400' : ''}`}
                  autoComplete="family-name"
                />
                <Err field="lastName" />
              </div>

              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="email@example.com"
                  className={`${inputCls} ${errors.email ? 'border-red-400' : ''}`}
                  autoComplete="email"
                />
                <Err field="email" />
              </div>

              <div>
                <label className={labelCls}>Mobile Number</label>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={handleChange('mobile')}
                  placeholder="10-digit number"
                  maxLength={10}
                  className={`${inputCls} ${errors.mobile ? 'border-red-400' : ''}`}
                  autoComplete="tel"
                />
                <Err field="mobile" />
              </div>

              <div>
                <label className={labelCls}>Date of Birth</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange('dateOfBirth')}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Gender</label>
                <div className="flex gap-5 mt-2">
                  {['male', 'female', 'other'].map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={handleChange('gender')}
                      />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ── Address ── */}
          <Section title="Address">
            <div className="space-y-3">
              <input
                type="text"
                value={form.addressLine1}
                onChange={handleChange('addressLine1')}
                placeholder="Address Line 1"
                className={inputCls}
              />
              <input
                type="text"
                value={form.addressLine2}
                onChange={handleChange('addressLine2')}
                placeholder="Address Line 2 (optional)"
                className={inputCls}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={form.city}
                  onChange={handleChange('city')}
                  placeholder="City"
                  className={inputCls}
                />
                <input
                  type="text"
                  value={form.state}
                  onChange={handleChange('state')}
                  placeholder="State"
                  className={inputCls}
                />
                <div>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={handleChange('pincode')}
                    placeholder="Pincode"
                    maxLength={6}
                    className={`${inputCls} ${errors.pincode ? 'border-red-400' : ''}`}
                  />
                  <Err field="pincode" />
                </div>
              </div>
            </div>
          </Section>

          {/* ── Education & Background ── */}
          <Section title="Education & Background">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Qualification</label>
                <input
                  type="text"
                  value={form.qualification}
                  onChange={handleChange('qualification')}
                  placeholder="e.g. BTech, BSc"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Specialization</label>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={handleChange('specialization')}
                  placeholder="e.g. Computer Science"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Passing Year</label>
                <input
                  type="number"
                  value={form.passingYear}
                  onChange={handleChange('passingYear')}
                  placeholder="2024"
                  min="1990"
                  max={new Date().getFullYear() + 2}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Technical Background</label>
              <select
                value={form.techBackground}
                onChange={handleChange('techBackground')}
                className={inputCls}
              >
                <option value="">Select background</option>
                <option value="tech">Tech</option>
                <option value="non-tech">Non-Tech</option>
              </select>
            </div>
          </Section>

          {/* ── Course Interest ── */}
          <Section title="Course Interest">
            <div>
              <label className={labelCls}>Interested Area</label>
              <input
                type="text"
                value={form.interestedArea}
                onChange={handleChange('interestedArea')}
                placeholder="e.g. Web Development, Data Science, AI/ML"
                className={inputCls}
              />
            </div>
          </Section>

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Saving...'
                : isEdit
                ? 'Update Inquiry'
                : 'Create Inquiry'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/inquiry')}
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
