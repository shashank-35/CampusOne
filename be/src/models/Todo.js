const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    todo: { type: String, required: [true, 'Todo text is required'], trim: true },
    important: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: {
      type: String,
      enum: ['work', 'personal', 'study'],
      default: 'work',
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);
