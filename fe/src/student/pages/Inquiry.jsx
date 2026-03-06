import { useState, useEffect } from 'react';
import { ClipboardList, User, Calendar, MessageSquare, CheckCircle, Circle } from 'lucide-react';
import studentPortalService from '@/services/studentPortalService';

const STATUS_ORDER = ['new', 'contacted', 'interested', 'admission-done'];

const STATUS_CONFIG = {
  new:              { label: 'Inquiry Submitted',     cls: 'bg-blue-100 text-blue-700 border-blue-200',   icon: '📋', step: 0 },
  contacted:        { label: 'Counselor Contacted',   cls: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '📞', step: 1 },
  interested:       { label: 'Follow-up Scheduled',   cls: 'bg-purple-100 text-purple-700 border-purple-200', icon: '🗓️', step: 2 },
  'admission-done': { label: 'Admission Completed',   cls: 'bg-green-100 text-green-700 border-green-200', icon: '🎓', step: 3 },
  'not-interested': { label: 'Not Interested',        cls: 'bg-red-100 text-red-700 border-red-200',     icon: '❌', step: -1 },
  closed:           { label: 'Closed',                cls: 'bg-gray-100 text-gray-600 border-gray-200',   icon: '🔒', step: -1 },
};

const TIMELINE_STEPS = [
  { key: 'new',              label: 'Inquiry Submitted',   desc: 'Your inquiry has been received' },
  { key: 'contacted',        label: 'Counselor Contacted', desc: 'A counselor has reached out' },
  { key: 'interested',       label: 'Follow-up Scheduled', desc: 'Follow-up meeting arranged' },
  { key: 'admission-done',   label: 'Admission Complete',  desc: 'Welcome to CampusOne!' },
];

function TimelineStepper({ currentStatus }) {
  const cfg = STATUS_CONFIG[currentStatus];
  const currentStep = cfg?.step ?? -1;
  const isNegative = currentStep === -1;

  return (
    <div className="relative">
      {/* Connector line */}
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 hidden sm:block" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {TIMELINE_STEPS.map(({ key, label, desc }, idx) => {
          const done = !isNegative && currentStep >= idx;
          const active = !isNegative && currentStep === idx;
          return (
            <div key={key} className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                  done
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-gray-100 text-gray-400'
                } ${active ? 'ring-4 ring-indigo-100' : ''}`}
              >
                {done ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </div>
              <div className="sm:text-center">
                <p className={`text-sm font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-400 hidden sm:block mt-0.5">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      {isNegative && (
        <div className={`mt-4 px-4 py-3 rounded-xl border text-sm font-medium ${STATUS_CONFIG[currentStatus]?.cls}`}>
          {STATUS_CONFIG[currentStatus]?.icon} {STATUS_CONFIG[currentStatus]?.label}
        </div>
      )}
    </div>
  );
}

export default function Inquiry() {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentPortalService.getInquiry()
      .then((res) => setInquiry(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-4">
        {[1,2,3].map((i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <ClipboardList className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No inquiry found</p>
          <p className="text-gray-400 text-sm mt-1">Your inquiry details will appear here once submitted.</p>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.new;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Inquiry Status</h2>
        <p className="text-sm text-gray-500 mt-0.5">Track the progress of your admission inquiry</p>
      </div>

      {/* Status Banner */}
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border font-semibold text-sm ${statusCfg.cls}`}>
        <span className="text-lg">{statusCfg.icon}</span>
        <div>
          <p className="font-semibold">Current Status: {statusCfg.label}</p>
          <p className="text-xs opacity-70 font-normal mt-0.5 capitalize">{inquiry.status?.replace('-', ' ')}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Progress Timeline</h3>
        <TimelineStepper currentStatus={inquiry.status} />
      </div>

      {/* Inquiry Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-indigo-600" />
          Inquiry Details
        </h3>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-sm">
          {[
            { label: 'Full Name',       value: inquiry.name },
            { label: 'Email',           value: inquiry.email },
            { label: 'Mobile',          value: inquiry.mobile },
            { label: 'Interested Area', value: inquiry.interestedArea },
            { label: 'Course',          value: inquiry.courseName },
            {
              label: 'Submitted',
              value: inquiry.createdAt
                ? new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : null,
            },
          ].map(({ label, value }) => value ? (
            <div key={label}>
              <dt className="text-xs text-gray-400 mb-0.5">{label}</dt>
              <dd className="font-medium text-gray-800">{value}</dd>
            </div>
          ) : null)}
        </dl>
      </div>

      {/* Counselor Info */}
      {inquiry.assignedTo && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-600" />
            Your Counselor
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {inquiry.assignedTo.firstName?.[0]}{inquiry.assignedTo.lastName?.[0]}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {inquiry.assignedTo.firstName} {inquiry.assignedTo.lastName}
              </p>
              {inquiry.assignedTo.email && (
                <p className="text-sm text-gray-500">{inquiry.assignedTo.email}</p>
              )}
            </div>
          </div>
          {inquiry.followUpDate && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-indigo-50 rounded-xl px-4 py-3">
              <Calendar className="h-4 w-4 text-indigo-500" />
              Follow-up scheduled:{' '}
              <span className="font-medium text-gray-900">
                {new Date(inquiry.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {inquiry.notes?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-600" />
            Counselor Notes
          </h3>
          <div className="space-y-3">
            {inquiry.notes.map((note, i) => (
              <div key={i} className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-sm text-gray-700">{note.text || note.note || note}</p>
                {note.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
