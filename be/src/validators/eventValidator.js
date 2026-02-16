const { body } = require('express-validator');

const createEventRules = [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('type').optional().isIn(['seminar', 'workshop', 'webinar', 'cultural', 'sports']).withMessage('Invalid event type'),
  body('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Invalid status'),
];

const updateEventRules = [
  body('title').optional().trim().notEmpty().withMessage('Event title cannot be empty'),
  body('type').optional().isIn(['seminar', 'workshop', 'webinar', 'cultural', 'sports']).withMessage('Invalid event type'),
  body('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Invalid status'),
];

module.exports = { createEventRules, updateEventRules };
