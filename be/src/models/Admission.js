const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema(
  {
    // ── Student Info ──
    studentName: { type: String, required: [true, 'Student name is required'], trim: true },
    email:       { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
    mobile:      { type: String, required: [true, 'Mobile is required'], trim: true },
    dateOfBirth: { type: Date },
    gender:      { type: String, enum: ['male', 'female', 'other'] },

    // ── Course ──
    courseId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    courseName: { type: String, trim: true },

    // ── Admission Details ──
    admissionDate: { type: Date, default: Date.now },
    batch:         { type: String, trim: true },

    // ── Fees ──
    totalFees: { type: Number, required: [true, 'Total fees is required'], min: 0 },
    discount:  { type: Number, default: 0, min: 0 },
    finalFees: { type: Number, min: 0 },

    // ── Payment ──
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid'],
      default: 'pending',
    },

    // ── Documents (stored as file paths) ──
    documents: {
      photo:     { type: String, default: null },
      idProof:   { type: String, default: null },
      marksheet: { type: String, default: null },
    },

    // ── Status ──
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    // ── Notes ──
    notes: { type: String, trim: true },

    // ── Relations ──
    inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', default: null },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-compute finalFees before save
admissionSchema.pre('save', function () {
  this.finalFees = Math.max(0, (this.totalFees || 0) - (this.discount || 0));
});

admissionSchema.index({ email: 1 });
admissionSchema.index({ status: 1 });
admissionSchema.index({ paymentStatus: 1 });
admissionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Admission', admissionSchema);
