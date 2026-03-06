const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    text:    { type: String, required: true, trim: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, _id: true }
);

const inquirySchema = new mongoose.Schema(
  {
    sourceOfInquiry: {
      type: String,
      enum: ['website', 'reference', 'social', 'walk-in', 'qr-code'],
      default: 'walk-in',
    },
    firstName:    { type: String, required: [true, 'First name is required'], trim: true },
    lastName:     { type: String, required: [true, 'Last name is required'],  trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    dateOfBirth:  { type: Date },
    gender:       { type: String, enum: ['male', 'female', 'other'] },
    mobile:       { type: String, trim: true },
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city:         { type: String, trim: true },
    state:        { type: String, trim: true },
    pincode:      { type: String, trim: true, maxlength: 6 },
    techBackground: { type: String, enum: ['tech', 'non-tech'] },
    qualification:  { type: String, trim: true },
    specialization: { type: String, trim: true },
    passingYear:    { type: String, trim: true },
    interestedArea: { type: String, trim: true },
    interestedCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    // Workflow fields
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    followUpDate: { type: Date, default: null },
    notes: [noteSchema],
    convertedStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
    status: {
      type: String,
      enum: ['new', 'contacted', 'interested', 'admission-done', 'not-interested', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

// Full-text index for search
inquirySchema.index({ firstName: 'text', lastName: 'text', email: 'text', mobile: 'text' });

module.exports = mongoose.model('Inquiry', inquirySchema);
