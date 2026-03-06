import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import studentPortalService from '@/services/studentPortalService';
import { useStudentAuth } from '@/context/StudentAuthContext';

const STATUS_COLORS = {
  new:              'bg-blue-100 text-blue-700',
  contacted:        'bg-yellow-100 text-yellow-700',
  interested:       'bg-purple-100 text-purple-700',
  'admission-done': 'bg-green-100 text-green-700',
  'not-interested': 'bg-red-100 text-red-700',
  closed:           'bg-gray-100 text-gray-600',
};

export default function StudentDashboard() {
  const { student } = useStudentAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentPortalService
      .getDashboard()
      .then((res) => setData(res.data.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
      </div>
    );
  }

  const inquiryStatus = data?.inquiry?.status;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome, {student?.firstName}!
        </h2>
        <p className="text-gray-500 text-sm mt-1">Here's an overview of your account.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Available Courses"
          value={data?.coursesCount ?? 0}
          icon="📚"
          href="/student-courses"
          color="bg-blue-50 border-blue-200"
        />
        <StatCard
          label="Upcoming Events"
          value={data?.upcomingEventsCount ?? 0}
          icon="📅"
          href="/student-events"
          color="bg-purple-50 border-purple-200"
        />
        <StatCard
          label="Inquiry Status"
          value={inquiryStatus ? inquiryStatus.replace('-', ' ') : 'N/A'}
          icon="📋"
          href="/student-inquiry-status"
          color="bg-green-50 border-green-200"
          capitalize
        />
      </div>

      {/* Inquiry summary */}
      {data?.inquiry && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Inquiry Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">Status</p>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  STATUS_COLORS[inquiryStatus] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {inquiryStatus?.replace('-', ' ')}
              </span>
            </div>
            {data.inquiry.assignedTo && (
              <div>
                <p className="text-gray-500 text-xs mb-1">Assigned Counselor</p>
                <p className="text-gray-800 font-medium">
                  {data.inquiry.assignedTo.firstName} {data.inquiry.assignedTo.lastName}
                </p>
              </div>
            )}
            {data.inquiry.followUpDate && (
              <div>
                <p className="text-gray-500 text-xs mb-1">Follow-Up Date</p>
                <p className="text-gray-800">
                  {new Date(data.inquiry.followUpDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
            )}
            {data.inquiry.interestedArea && (
              <div>
                <p className="text-gray-500 text-xs mb-1">Interested Area</p>
                <p className="text-gray-800">{data.inquiry.interestedArea}</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Link
              to="/student-inquiry-status"
              className="text-slate-800 text-sm font-medium hover:underline"
            >
              View full details →
            </Link>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Browse Courses', to: '/student-courses', icon: '📚' },
          { label: 'View Events',    to: '/student-events',  icon: '📅' },
          { label: 'My Inquiry',     to: '/student-inquiry-status', icon: '📋' },
          { label: 'My Profile',     to: '/student-profile', icon: '👤' },
        ].map(({ label, to, icon }) => (
          <Link
            key={to}
            to={to}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md hover:border-slate-300 transition-all"
          >
            <span className="text-2xl">{icon}</span>
            <p className="text-sm font-medium text-gray-700 mt-2">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, href, color, capitalize }) {
  return (
    <Link
      to={href}
      className={`border rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow ${color}`}
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className={`text-xl font-bold text-gray-900 mt-0.5 ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </p>
      </div>
    </Link>
  );
}
