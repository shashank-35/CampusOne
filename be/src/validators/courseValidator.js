const { body } = require('express-validator');

const createCourseRules = [
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('status').optional().isIn(['active', 'inactive', 'draft']).withMessage('Invalid status'),
];

const updateCourseRules = [
  body('title').optional().trim().notEmpty().withMessage('Course title cannot be empty'),
  body('status').optional().isIn(['active', 'inactive', 'draft']).withMessage('Invalid status'),
];

module.exports = { createCourseRules, updateCourseRules };
