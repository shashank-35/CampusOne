import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { BookOpen, Calendar, ClipboardList, Bell, ArrowRight, TrendingUp, User } from 'lucide-react';
import studentPortalService from '@/services/studentPortalService';
import { useStudentAuth } from '@/context/StudentAuthContext';

const STATUS_CONFIG = {
  new:              { label: 'New',              cls: 'bg-blue-100 text-blue-700' },
  contacted:        { label: 'Contacted',        cls: 'bg-yellow-100 text-yellow-700' },
  interested:       { label: 'Interested',       cls: 'bg-purple-100 text-purple-700' },
  'admission-done': { label: 'Admission Done',   cls: 'bg-green-100 text-green-700' },
  'not-interested': { label: 'Not Interested',   cls: 'bg-red-100 text-red-700' },
  closed:           { label: 'Closed',           cls: 'bg-gray-100 text-gray-600' },
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export default function Dashboard() {
  const { student } = useStudentAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentPortalService.getDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const inquiryStatus = data?.inquiry?.status;
  const statusCfg = STATUS_CONFIG[inquiryStatus] || STATUS_CONFIG.new;

  const STATS = [
    {
      label: 'Available Courses',
      value: data?.coursesCount ?? 0,
      icon: BookOpen,
      to: '/student-courses',
      gradient: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
    },
    {
      label: 'Upcoming Events',
      value: data?.upcomingEventsCount ?? 0,
      icon: Calendar,
      to: '/student-events',
      gradient: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
    },
    {
      label: 'Inquiry Status',
      value: inquiryStatus ? statusCfg.label : 'No inquiry',
      icon: ClipboardList,
      to: '/student-inquiry-status',
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      isText: true,
    },
  ];

  const QUICK = [
    { label: 'View Courses',     to: '/student-courses',         icon: BookOpen,     color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' },
    { label: 'Browse Events',    to: '/student-events',          icon: Calendar,     color: 'bg-violet-50 text-violet-600 hover:bg-violet-100' },
    { label: 'Track Inquiry',    to: '/student-inquiry-status',  icon: ClipboardList,color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
    { label: 'Edit Profile',     to: '/student-profile',         icon: User,         color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white" />
          <div className="absolute -bottom-12 -left-8 w-64 h-64 rounded-full bg-white" />
        </div>
        <div className="relative">
          <p className="text-indigo-200 text-sm font-medium mb-1">{greeting},</p>
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">
            {student?.firstName} {student?.lastName} 👋
          </h2>
          <p className="text-indigo-200 text-sm">
            Welcome back to your student portal. Here's your overview.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading
          ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
          : STATS.map(({ label, value, icon: Icon, to, bg, text, isText }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${text}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className={`font-bold text-gray-900 ${isText ? 'text-base capitalize' : 'text-2xl'}`}>
                {value}
              </p>
            </Link>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiry Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              Inquiry Summary
            </h3>
            <Link
              to="/student-inquiry-status"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : data?.inquiry ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusCfg.cls}`}>
                    {statusCfg.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {data.inquiry.assignedTo && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Counselor</p>
                      <p className="font-medium text-gray-800">
                        {data.inquiry.assignedTo.firstName} {data.inquiry.assignedTo.lastName}
                      </p>
                    </div>
                  )}
                  {data.inquiry.followUpDate && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Follow-up Date</p>
                      <p className="font-medium text-gray-800">
                        {new Date(data.inquiry.followUpDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  {data.inquiry.interestedArea && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Interested Area</p>
                      <p className="font-medium text-gray-800">{data.inquiry.interestedArea}</p>
                    </div>
                  )}
                  {data.inquiry.courseName && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Course</p>
                      <p className="font-medium text-gray-800">{data.inquiry.courseName}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No inquiry found</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-2">
            {QUICK.map(({ label, to, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${color}`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
                <ArrowRight className="h-3 w-3 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
