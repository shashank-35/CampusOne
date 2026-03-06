import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Trash2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStudentAuth } from '@/context/StudentAuthContext';
import { useNavigate } from 'react-router';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { logout } = useStudentAuth();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [prefs, setPrefs] = useState({
    emailNotifications:  true,
    eventReminders:      true,
    inquiryUpdates:      true,
    profileVisibility:   false,
  });

  const toggle = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    toast.success('Preference saved');
  };

  const handleDeleteRequest = () => {
    if (confirmDelete) {
      toast('Account deletion request sent to admin', { icon: 'ℹ️' });
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
        </div>
        <div className="px-6 divide-y divide-gray-50">
          <SettingRow label="Email Notifications" desc="Receive updates via email">
            <Toggle checked={prefs.emailNotifications} onChange={() => toggle('emailNotifications')} />
          </SettingRow>
          <SettingRow label="Event Reminders" desc="Get reminded about upcoming events">
            <Toggle checked={prefs.eventReminders} onChange={() => toggle('eventReminders')} />
          </SettingRow>
          <SettingRow label="Inquiry Updates" desc="Notifications about your inquiry status">
            <Toggle checked={prefs.inquiryUpdates} onChange={() => toggle('inquiryUpdates')} />
          </SettingRow>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Shield className="h-4 w-4 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
        </div>
        <div className="px-6 divide-y divide-gray-50">
          <SettingRow label="Profile Visibility" desc="Allow staff to see your profile details">
            <Toggle checked={prefs.profileVisibility} onChange={() => toggle('profileVisibility')} />
          </SettingRow>
          <SettingRow label="Change Password" desc="Update your account password">
            <button
              onClick={() => navigate('/student-profile')}
              className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:underline"
            >
              Go to Profile <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-red-50 flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-500" />
          <h3 className="font-semibold text-red-600">Danger Zone</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Requesting account deletion will send a notice to the admin. Your data will be reviewed before removal.
          </p>
          <button
            onClick={handleDeleteRequest}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              confirmDelete
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'border border-red-300 text-red-600 hover:bg-red-50'
            }`}
          >
            {confirmDelete ? 'Confirm — Send Deletion Request' : 'Request Account Deletion'}
          </button>
          {confirmDelete && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="ml-3 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
