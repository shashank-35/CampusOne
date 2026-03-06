import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import api from '@/services/api';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    dateOfBirth: '', gender: '', mobileNumber: '',
    addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
    role: 'receptionist', status: 'active',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    api.get(`/users/${id}`)
      .then((res) => {
        const u = res.data.data;
        setForm({
          firstName: u.firstName || '', lastName: u.lastName || '',
          email: u.email || '', password: '',
          dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split('T')[0] : '',
          gender: u.gender || '', mobileNumber: u.mobileNumber || '',
          addressLine1: u.addressLine1 || '', addressLine2: u.addressLine2 || '',
          city: u.city || '', state: u.state || '', pincode: u.pincode || '',
          role: u.role || 'receptionist', status: u.status || 'active',
        });
      })
      .catch(() => toast.error('Failed to load user'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error('Name and email are required');
      return;
    }
    if (!isEdit && !form.password) {
      toast.error('Password is required');
      return;
    }

    const payload = { ...form };
    if (!payload.password) delete payload.password; // Don't send empty password on edit

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/users/${id}`, payload);
        toast.success('User updated successfully');
      } else {
        await api.post('/users', payload);
        toast.success('User created successfully');
      }
      navigate('/user');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-3xl bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="bg-slate-800 px-6 py-4">
          <h2 className="text-white font-semibold text-lg">{isEdit ? 'Edit User' : 'Create User'}</h2>
          <p className="text-slate-300 text-sm mt-0.5">
            {isEdit ? 'Update user account details' : 'Add a new staff account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First Name *</label>
                <input value={form.firstName} onChange={set('firstName')} className={inputCls} placeholder="First name" required />
              </div>
              <div>
                <label className={labelCls}>Last Name *</label>
                <input value={form.lastName} onChange={set('lastName')} className={inputCls} placeholder="Last name" required />
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input type="email" value={form.email} onChange={set('email')} className={inputCls} placeholder="email@example.com" required />
              </div>
              <div>
                <label className={labelCls}>
                  Password {isEdit && <span className="text-gray-400 font-normal">(leave blank to keep)</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  className={inputCls}
                  placeholder={isEdit ? 'Leave blank to keep current' : 'Min 6 characters'}
                />
              </div>
              <div>
                <label className={labelCls}>Mobile Number</label>
                <input type="tel" value={form.mobileNumber} onChange={set('mobileNumber')} className={inputCls} placeholder="10-digit number" maxLength={10} />
              </div>
              <div>
                <label className={labelCls}>Date of Birth</label>
                <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Gender</label>
                <div className="flex gap-4 mt-2">
                  {['male', 'female', 'other'].map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={set('gender')} />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Role & Status */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">Role & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Role *</label>
                <select value={form.role} onChange={set('role')} className={inputCls}>
                  <option value="receptionist">Receptionist</option>
                  <option value="counselor">Counselor</option>
                  <option value="admin">Admin (only 1 allowed)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.status} onChange={set('status')} className={inputCls}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition disabled:opacity-60"
            >
              {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/user')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
