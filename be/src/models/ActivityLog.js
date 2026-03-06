const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action:      { type: String, required: true, trim: true },
    module:      { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ipAddress:   { type: String, trim: true },
    userAgent:   { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
