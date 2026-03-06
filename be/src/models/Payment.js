const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    // ── Receipt Identifier ──
    receiptNumber: { type: String, unique: true },   // auto-generated: RCP-2025-000001

    // ── Relations ──
    studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    admissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission' },

    // ── Denormalized for fast reads / receipts ──
    studentName: { type: String, required: [true, 'Student name is required'], trim: true },
    courseName:  { type: String, trim: true },
    email:       { type: String, trim: true, lowercase: true },
    mobile:      { type: String, trim: true },

    // ── Fees ──
    totalFees:       { type: Number, required: [true, 'Total fees is required'], min: 0 },
    paidAmount:      { type: Number, required: [true, 'Paid amount is required'], min: 0 },
    remainingAmount: { type: Number, min: 0 },   // auto-computed

    // ── Payment Details ──
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'card', 'bank'],
      required: [true, 'Payment method is required'],
    },
    transactionId: { type: String, trim: true },

    // ── Status ──
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid'],
      default: 'pending',
    },

    // ── Notes ──
    notes: { type: String, trim: true },

    // ── Audit ──
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-compute remainingAmount and status before save
paymentSchema.pre('save', async function () {
  this.remainingAmount = Math.max(0, this.totalFees - this.paidAmount);

  if (this.paidAmount <= 0)               this.status = 'pending';
  else if (this.paidAmount >= this.totalFees) this.status = 'paid';
  else                                    this.status = 'partial';

  // Generate receipt number on first save
  if (!this.receiptNumber) {
    const year  = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.receiptNumber = `RCP-${year}-${String(count + 1).padStart(6, '0')}`;
  }
});

paymentSchema.index({ studentId: 1 });
paymentSchema.index({ admissionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentDate: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
