import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import studentPortalService from '@/services/studentPortalService';
import { useStudentAuth } from '@/context/StudentAuthContext';

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export default function StudentProfile() {
  const { student: authStudent, updateStudentData } = useStudentAuth();
  const [tab, setTab]         = useState('profile');
  const [profile, setProfile] = useState(null);
  const [form, setForm]       = useState({
    firstName: '', lastName: '', mobileNumber: '', address: '', city: '', state: '', pincode: '',
  });
  const [pwForm, setPwForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentPortalService
      .getProfile()
      .then((res) => {
        const { user, student } = res.data.data;
        setProfile({ user, student });
        setForm({
          firstName:    user?.firstName    || '',
          lastName:     user?.lastName     || '',
          mobileNumber: student?.mobileNumber || '',
          address:      student?.address   || '',
          city:         student?.city      || '',
          state:        student?.state     || '',
          pincode:      student?.pincode   || '',
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePwChange = (field) => (e) =>
    setPwForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await studentPortalService.updateProfile(form);
      updateStudentData({ firstName: form.firstName, lastName: form.lastName });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await studentPortalService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
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
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {['profile', 'password'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'profile' ? 'Profile Info' : 'Change Password'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-white text-2xl font-bold">
              {form.firstName?.[0]?.toUpperCase() || 'S'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">
                {form.firstName} {form.lastName}
              </p>
              <p className="text-gray-500 text-sm">{profile?.user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                Student
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First Name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Mobile Number</label>
                <input
                  type="tel"
                  value={form.mobileNumber}
                  onChange={handleChange('mobileNumber')}
                  placeholder="10-digit number"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={handleChange('city')}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={handleChange('state')}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Pincode</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={handleChange('pincode')}
                  maxLength={6}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <input
                type="text"
                value={form.address}
                onChange={handleChange('address')}
                className={inputCls}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Change Password</h3>
          <form onSubmit={handlePasswordSave} className="space-y-4 max-w-sm">
            <div>
              <label className={labelCls}>Current Password</label>
              <input
                type="password"
                value={pwForm.currentPassword}
                onChange={handlePwChange('currentPassword')}
                className={inputCls}
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className={labelCls}>New Password</label>
              <input
                type="password"
                value={pwForm.newPassword}
                onChange={handlePwChange('newPassword')}
                className={inputCls}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className={labelCls}>Confirm New Password</label>
              <input
                type="password"
                value={pwForm.confirmPassword}
                onChange={handlePwChange('confirmPassword')}
                className={inputCls}
                autoComplete="new-password"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
