const { body } = require('express-validator');

const createUserRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'counselor', 'receptionist']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  body('mobileNumber').optional().isMobilePhone().withMessage('Please provide a valid mobile number'),
];

const updateUserRules = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty').isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').optional().trim().isEmail().withMessage('Please provide a valid email'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'counselor', 'receptionist']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  body('mobileNumber').optional().isMobilePhone().withMessage('Please provide a valid mobile number'),
];

module.exports = { createUserRules, updateUserRules };
