const { body } = require('express-validator');

const createAdmissionRules = [
  body('studentName')
    .trim().notEmpty().withMessage('Student name is required')
    .isLength({ min: 2 }).withMessage('Student name must be at least 2 characters'),
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('mobile')
    .trim().notEmpty().withMessage('Mobile is required')
    .matches(/^\d{10}$/).withMessage('Mobile must be exactly 10 digits'),
  body('gender')
    .optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('courseName')
    .trim().notEmpty().withMessage('Course name is required'),
  body('totalFees')
    .notEmpty().withMessage('Total fees is required')
    .isNumeric().withMessage('Total fees must be a number')
    .custom((v) => v >= 0).withMessage('Total fees cannot be negative'),
  body('discount')
    .optional().isNumeric().withMessage('Discount must be a number')
    .custom((v) => v >= 0).withMessage('Discount cannot be negative'),
  body('paymentStatus')
    .optional().isIn(['pending', 'partial', 'paid']).withMessage('Invalid payment status'),
  body('status')
    .optional().isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
  body('batch')
    .optional().trim(),
];

const updateAdmissionRules = [
  body('studentName')
    .optional().trim().isLength({ min: 2 }).withMessage('Student name must be at least 2 characters'),
  body('email')
    .optional().trim().isEmail().withMessage('Please provide a valid email'),
  body('mobile')
    .optional().matches(/^\d{10}$/).withMessage('Mobile must be exactly 10 digits'),
  body('gender')
    .optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('totalFees')
    .optional().isNumeric().withMessage('Total fees must be a number')
    .custom((v) => v >= 0).withMessage('Total fees cannot be negative'),
  body('discount')
    .optional().isNumeric().withMessage('Discount must be a number')
    .custom((v) => v >= 0).withMessage('Discount cannot be negative'),
  body('paymentStatus')
    .optional().isIn(['pending', 'partial', 'paid']).withMessage('Invalid payment status'),
  body('status')
    .optional().isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
];

module.exports = { createAdmissionRules, updateAdmissionRules };
