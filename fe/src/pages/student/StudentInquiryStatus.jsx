import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import studentPortalService from '@/services/studentPortalService';

const STATUS_CONFIG = {
  new:              { color: 'bg-blue-100 text-blue-700',    label: 'New',              step: 0 },
  contacted:        { color: 'bg-yellow-100 text-yellow-700',label: 'Contacted',        step: 1 },
  interested:       { color: 'bg-purple-100 text-purple-700',label: 'Interested',       step: 2 },
  'admission-done': { color: 'bg-green-100 text-green-700',  label: 'Admission Done',   step: 3 },
  'not-interested': { color: 'bg-red-100 text-red-700',      label: 'Not Interested',   step: -1 },
  closed:           { color: 'bg-gray-100 text-gray-600',    label: 'Closed',           step: -1 },
};

const STEPS = ['New', 'Contacted', 'Interested', 'Admission Done'];

export default function StudentInquiryStatus() {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentPortalService
      .getInquiry()
      .then((res) => setInquiry(res.data.data))
      .catch(() => toast.error('Failed to load inquiry'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Inquiry</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium text-gray-700">No inquiry found</p>
          <p className="text-sm mt-1">Your inquiry details will appear here once linked to your account.</p>
        </div>
      </div>
    );
  }

  const statusCfg  = STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.new;
  const currentStep = statusCfg.step;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Inquiry</h2>

      {/* Status banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Current Status</p>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
          </div>
          {inquiry.createdAt && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Submitted on</p>
              <p className="text-sm text-gray-700 font-medium">
                {new Date(inquiry.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        {/* Progress stepper — only for positive statuses */}
        {currentStep >= 0 && (
          <div className="flex items-center gap-0">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i <= currentStep
                        ? 'bg-slate-800 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i <= currentStep ? '✓' : i + 1}
                  </div>
                  <p
                    className={`text-xs mt-1 whitespace-nowrap ${
                      i <= currentStep ? 'text-slate-800 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {step}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 mb-5 ${
                      i < currentStep ? 'bg-slate-800' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details grid */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Inquiry Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <InfoRow label="Full Name" value={`${inquiry.firstName} ${inquiry.lastName}`} />
          <InfoRow label="Interested Area" value={inquiry.interestedArea} />
          <InfoRow label="Source" value={inquiry.sourceOfInquiry?.replace('-', ' ')} capitalize />
          {inquiry.followUpDate && (
            <InfoRow
              label="Follow-Up Date"
              value={new Date(inquiry.followUpDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            />
          )}
          {inquiry.assignedTo && (
            <InfoRow
              label="Assigned Counselor"
              value={`${inquiry.assignedTo.firstName} ${inquiry.assignedTo.lastName}`}
            />
          )}
          {inquiry.assignedTo?.email && (
            <InfoRow label="Counselor Email" value={inquiry.assignedTo.email} />
          )}
        </div>
      </div>

      {/* Notes from counselor */}
      {inquiry.notes && inquiry.notes.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Counselor Notes</h3>
          <div className="space-y-3">
            {inquiry.notes.map((note, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-gray-800 text-sm leading-relaxed">{note.text}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  {note.addedBy && (
                    <span>
                      {note.addedBy.firstName} {note.addedBy.lastName}
                    </span>
                  )}
                  {note.addedAt && (
                    <>
                      <span>·</span>
                      <span>
                        {new Date(note.addedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, capitalize }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-gray-400 text-xs mb-0.5">{label}</p>
      <p className={`text-gray-800 font-medium ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}
