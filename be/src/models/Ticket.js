const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    student:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category:   {
      type: String,
      enum: ['admission', 'fees', 'course', 'technical', 'other'],
      required: true,
    },
    subject:    { type: String, required: true, trim: true },
    message:    { type: String, required: true, trim: true },
    status:     {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reply:      { type: String, default: null },
    repliedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    repliedAt:  { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
