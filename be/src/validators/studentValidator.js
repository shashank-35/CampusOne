const { body } = require('express-validator');

const createStudentRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('pincode').optional().isLength({ max: 6 }).withMessage('Pincode must be at most 6 characters'),
  body('background').optional().isIn(['tech', 'non-tech']).withMessage('Invalid background'),
  body('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status'),
];

const updateStudentRules = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('Please provide a valid email'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('pincode').optional().isLength({ max: 6 }).withMessage('Pincode must be at most 6 characters'),
  body('background').optional().isIn(['tech', 'non-tech']).withMessage('Invalid background'),
  body('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status'),
];

module.exports = { createStudentRules, updateStudentRules };
