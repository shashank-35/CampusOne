import { useState } from 'react';
import { useForm } from 'react-hook-form';
import inquiryService from '@/services/inquiryService';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errorCls = 'text-red-500 text-xs mt-1';

export default function PublicInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues: { sourceOfInquiry: 'qr-code', gender: 'male' } });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await inquiryService.publicCreate(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Submission failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Submitted!</h2>
          <p className="text-gray-500 mb-6">
            Thank you for your interest in CampusOne. We've received your inquiry and will contact you within 24–48 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">CampusOne</h1>
          <p className="text-gray-500 mt-1">Fill in your details to get started with your admission inquiry.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-slate-800 px-6 py-4">
            <h2 className="text-white font-semibold text-lg">Student Inquiry Form</h2>
            <p className="text-slate-300 text-sm">All fields marked with * are required</p>
          </div>

          {serverError && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Source */}
            <input type="hidden" {...register('sourceOfInquiry')} />

            {/* Personal Info */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>First Name *</label>
                  <input
                    {...register('firstName', { required: 'First name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                    className={inputCls}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className={errorCls}>{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Last Name *</label>
                  <input
                    {...register('lastName', { required: 'Last name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                    className={inputCls}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className={errorCls}>{errors.lastName.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                    })}
                    className={inputCls}
                    placeholder="example@mail.com"
                  />
                  {errors.email && <p className={errorCls}>{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Mobile Number *</label>
                  <input
                    type="tel"
                    {...register('mobile', {
                      required: 'Mobile number is required',
                      pattern: { value: /^\d{10}$/, message: 'Must be exactly 10 digits' },
                    })}
                    className={inputCls}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                  {errors.mobile && <p className={errorCls}>{errors.mobile.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <input type="date" {...register('dateOfBirth')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Gender *</label>
                  <div className="flex gap-4 mt-2">
                    {['male', 'female', 'other'].map((g) => (
                      <label key={g} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="radio" value={g} {...register('gender', { required: 'Gender is required' })} />
                        <span className="capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && <p className={errorCls}>{errors.gender.message}</p>}
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Address</h3>
              <div className="space-y-3">
                <input {...register('addressLine1')} className={inputCls} placeholder="Address Line 1" />
                <input {...register('addressLine2')} className={inputCls} placeholder="Address Line 2 (optional)" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input {...register('city')} className={inputCls} placeholder="City" />
                  <input {...register('state')} className={inputCls} placeholder="State" />
                  <input
                    {...register('pincode', { pattern: { value: /^\d{6}$/, message: 'Pincode must be 6 digits' } })}
                    className={inputCls}
                    placeholder="Pincode"
                    maxLength={6}
                  />
                </div>
                {errors.pincode && <p className={errorCls}>{errors.pincode.message}</p>}
              </div>
            </section>

            {/* Education */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Education Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Qualification</label>
                  <input {...register('qualification')} className={inputCls} placeholder="e.g. BTech, BSc" />
                </div>
                <div>
                  <label className={labelCls}>Specialization</label>
                  <input {...register('specialization')} className={inputCls} placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <label className={labelCls}>Passing Year</label>
                  <input
                    type="number"
                    {...register('passingYear', {
                      min: { value: 1990, message: 'Invalid year' },
                      max: { value: new Date().getFullYear() + 2, message: 'Invalid year' },
                    })}
                    className={inputCls}
                    placeholder="2024"
                  />
                  {errors.passingYear && <p className={errorCls}>{errors.passingYear.message}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className={labelCls}>Technical Background</label>
                <select {...register('techBackground')} className={inputCls}>
                  <option value="">Select background</option>
                  <option value="tech">Tech</option>
                  <option value="non-tech">Non-Tech</option>
                </select>
              </div>
            </section>

            {/* Interested Area */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Course Interest</h3>
              <div>
                <label className={labelCls}>Interested Area *</label>
                <input
                  {...register('interestedArea', { required: 'Please enter your area of interest' })}
                  className={inputCls}
                  placeholder="e.g. Web Development, Data Science, AI/ML"
                />
                {errors.interestedArea && <p className={errorCls}>{errors.interestedArea.message}</p>}
              </div>
            </section>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
