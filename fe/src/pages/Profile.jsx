import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock, Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import profileService from '@/services/profileService';
import { useAuth } from '@/context/AuthContext';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errorCls = 'text-red-500 text-xs mt-1';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function Profile() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();

  const profileForm = useForm();
  const passwordForm = useForm();

  useEffect(() => {
    profileService.get().then((res) => {
      const u = res.data.data;
      setProfileData(u);
      setImagePreview(u.profileImage ? `${API_BASE}${u.profileImage}` : null);
      profileForm.reset({
        firstName:    u.firstName    || '',
        lastName:     u.lastName     || '',
        mobileNumber: u.mobileNumber || '',
        dateOfBirth:  u.dateOfBirth ? u.dateOfBirth.split('T')[0] : '',
        gender:       u.gender       || '',
        addressLine1: u.addressLine1 || '',
        addressLine2: u.addressLine2 || '',
        city:         u.city         || '',
        state:        u.state        || '',
        pincode:      u.pincode      || '',
      });
    }).catch(() => {});
  }, []);

  const onProfileSubmit = async (data) => {
    try {
      await profileService.update(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await profileService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('image', file);
    try {
      await profileService.uploadImage(formData);
      toast.success('Profile image updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm">Manage your account settings</p>
      </div>

      {/* Profile Image */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
              {imagePreview
                ? <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                : <User className="w-10 h-10 text-slate-500" />
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-1.5 text-white hover:bg-slate-700"
            >
              <Camera className="w-3 h-3" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{profileData?.firstName} {profileData?.lastName}</p>
            <p className="text-gray-500 text-sm">{profileData?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full capitalize font-medium">
              {profileData?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-slate-800 text-slate-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First Name</label>
                <input
                  {...profileForm.register('firstName', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } })}
                  className={inputCls}
                />
                {profileForm.formState.errors.firstName && <p className={errorCls}>{profileForm.formState.errors.firstName.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Last Name</label>
                <input
                  {...profileForm.register('lastName', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } })}
                  className={inputCls}
                />
                {profileForm.formState.errors.lastName && <p className={errorCls}>{profileForm.formState.errors.lastName.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Mobile Number</label>
                <input
                  {...profileForm.register('mobileNumber', {
                    pattern: { value: /^\d{10}$/, message: '10-digit mobile required' },
                  })}
                  className={inputCls}
                  placeholder="10-digit number"
                  maxLength={10}
                />
                {profileForm.formState.errors.mobileNumber && <p className={errorCls}>{profileForm.formState.errors.mobileNumber.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Date of Birth</label>
                <input type="date" {...profileForm.register('dateOfBirth')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Gender</label>
                <select {...profileForm.register('gender')} className={inputCls}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">Address</h4>
              <input {...profileForm.register('addressLine1')} className={inputCls} placeholder="Address Line 1" />
              <input {...profileForm.register('addressLine2')} className={inputCls} placeholder="Address Line 2" />
              <div className="grid grid-cols-3 gap-3">
                <input {...profileForm.register('city')} className={inputCls} placeholder="City" />
                <input {...profileForm.register('state')} className={inputCls} placeholder="State" />
                <input {...profileForm.register('pincode')} className={inputCls} placeholder="Pincode" maxLength={6} />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileForm.formState.isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Password Form */}
        {activeTab === 'password' && (
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="p-6 space-y-4 max-w-md">
            <div>
              <label className={labelCls}>Current Password</label>
              <input
                type="password"
                {...passwordForm.register('currentPassword', { required: 'Required' })}
                className={inputCls}
                placeholder="Enter current password"
              />
              {passwordForm.formState.errors.currentPassword && <p className={errorCls}>{passwordForm.formState.errors.currentPassword.message}</p>}
            </div>
            <div>
              <label className={labelCls}>New Password</label>
              <input
                type="password"
                {...passwordForm.register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
                className={inputCls}
                placeholder="Min 6 characters"
              />
              {passwordForm.formState.errors.newPassword && <p className={errorCls}>{passwordForm.formState.errors.newPassword.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Confirm New Password</label>
              <input
                type="password"
                {...passwordForm.register('confirmPassword', { required: 'Required' })}
                className={inputCls}
                placeholder="Repeat new password"
              />
            </div>
            <button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              {passwordForm.formState.isSubmitting ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
