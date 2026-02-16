const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    sourceOfInquiry: {
      type: String,
      enum: ['website', 'reference', 'social'],
    },
    firstName: { type: String, required: [true, 'First name is required'], trim: true },
    lastName: { type: String, required: [true, 'Last name is required'], trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    mobile: { type: String, trim: true },
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true, maxlength: 6 },
    techBackground: { type: String, enum: ['tech', 'non-tech'] },
    qualification: { type: String, trim: true },
    specialization: { type: String, trim: true },
    passingYear: { type: String, trim: true },
    interestedArea: { type: String, trim: true },
    assignTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'resolved', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
