import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Lock, Camera, CheckCircle } from 'lucide-react';
import studentPortalService from '@/services/studentPortalService';
import { useStudentAuth } from '@/context/StudentAuthContext';

const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-colors';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

const TABS = [
  { id: 'profile',   label: 'Personal Info',  icon: User },
  { id: 'password',  label: 'Change Password', icon: Lock },
];

function CompletionBar({ profile }) {
  const fields = ['firstName','lastName','email','mobileNumber','dateOfBirth','gender','address','city'];
  const filled = fields.filter((f) => profile?.[f]).length;
  const pct = Math.round((filled / fields.length) * 100);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-900">Profile Completion</p>
        <span className="text-sm font-bold text-indigo-600">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct === 100 && (
        <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Profile complete!
        </p>
      )}
    </div>
  );
}

export default function Profile() {
  const { student, updateStudentData } = useStudentAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  const profileForm = useForm();
  const pwdForm = useForm();

  useEffect(() => {
    studentPortalService.getProfile()
      .then((res) => {
        const p = res.data.data;
        setProfile(p);
        profileForm.reset({
          firstName:    p.firstName    || '',
          lastName:     p.lastName     || '',
          email:        p.email        || '',
          mobileNumber: p.mobileNumber || '',
          dateOfBirth:  p.dateOfBirth  ? p.dateOfBirth.split('T')[0] : '',
          gender:       p.gender       || '',
          address:      p.address      || '',
          city:         p.city         || '',
        });
      })
      .catch(() => toast.error('Failed to load profile'));
  }, []);

  const onSaveProfile = async (data) => {
    setSaving(true);
    try {
      const res = await studentPortalService.updateProfile(data);
      const updated = res.data.data;
      setProfile(updated);
      updateStudentData({ firstName: updated.firstName, lastName: updated.lastName });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      pwdForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setChangingPwd(true);
    try {
      await studentPortalService.changePassword({
        currentPassword: data.currentPassword,
        newPassword:     data.newPassword,
      });
      toast.success('Password changed successfully');
      pwdForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your personal information and account settings</p>
      </div>

      {/* Avatar + Completion */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center sm:col-span-1">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
              {student?.firstName?.[0]}{student?.lastName?.[0]}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-indigo-700 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="font-semibold text-gray-900">{student?.firstName} {student?.lastName}</p>
          <p className="text-xs text-gray-400 mt-0.5">{student?.email}</p>
          <span className="mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium capitalize">
            {student?.role}
          </span>
        </div>
        <div className="sm:col-span-2">
          <CompletionBar profile={profile} />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                tab === id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Profile Form */}
          {tab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input {...profileForm.register('firstName', { required: true })} className={inputCls} placeholder="First name" />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input {...profileForm.register('lastName', { required: true })} className={inputCls} placeholder="Last name" />
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input type="email" {...profileForm.register('email')} className={`${inputCls} bg-gray-50`} readOnly />
                </div>
                <div>
                  <label className={labelCls}>Mobile Number</label>
                  <input type="tel" {...profileForm.register('mobileNumber')} className={inputCls} placeholder="10-digit number" />
                </div>
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <input type="date" {...profileForm.register('dateOfBirth')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Gender</label>
                  <select {...profileForm.register('gender')} className={inputCls}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Address</label>
                  <input {...profileForm.register('address')} className={inputCls} placeholder="Street address" />
                </div>
                <div>
                  <label className={labelCls}>City</label>
                  <input {...profileForm.register('city')} className={inputCls} placeholder="City" />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Password Form */}
          {tab === 'password' && (
            <form onSubmit={pwdForm.handleSubmit(onChangePassword)} className="space-y-4 max-w-md">
              <div>
                <label className={labelCls}>Current Password</label>
                <input
                  type="password"
                  {...pwdForm.register('currentPassword', { required: true })}
                  className={inputCls}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className={labelCls}>New Password</label>
                <input
                  type="password"
                  {...pwdForm.register('newPassword', { required: true, minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  className={inputCls}
                  placeholder="New password (min 6 chars)"
                />
                {pwdForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{pwdForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Confirm New Password</label>
                <input
                  type="password"
                  {...pwdForm.register('confirmPassword', { required: true })}
                  className={inputCls}
                  placeholder="Re-enter new password"
                />
                {pwdForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{pwdForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changingPwd}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {changingPwd ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
