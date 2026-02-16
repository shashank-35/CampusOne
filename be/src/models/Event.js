const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Event title is required'], trim: true },
    detail: { type: String, trim: true },
    host: { type: String, trim: true },
    coordinator: { type: String, trim: true },
    date: { type: Date },
    timing: { type: String, trim: true },
    place: { type: String, trim: true },
    type: {
      type: String,
      enum: ['seminar', 'workshop', 'webinar', 'cultural', 'sports'],
    },
    description: { type: String, trim: true },
    locationLink: { type: String, trim: true },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
