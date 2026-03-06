const { body } = require('express-validator');

const createPaymentRules = [
  body('studentName')
    .trim().notEmpty().withMessage('Student name is required'),
  body('totalFees')
    .notEmpty().withMessage('Total fees is required')
    .isNumeric().withMessage('Total fees must be a number')
    .custom((v) => Number(v) >= 0).withMessage('Total fees cannot be negative'),
  body('paidAmount')
    .notEmpty().withMessage('Paid amount is required')
    .isNumeric().withMessage('Paid amount must be a number')
    .custom((v) => Number(v) >= 0).withMessage('Paid amount cannot be negative'),
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['cash', 'upi', 'card', 'bank']).withMessage('Invalid payment method'),
  body('transactionId')
    .optional().trim(),
  body('paymentDate')
    .optional().isISO8601().withMessage('Invalid date format'),
];

const updatePaymentRules = [
  body('totalFees')
    .optional().isNumeric().withMessage('Total fees must be a number')
    .custom((v) => Number(v) >= 0).withMessage('Total fees cannot be negative'),
  body('paidAmount')
    .optional().isNumeric().withMessage('Paid amount must be a number')
    .custom((v) => Number(v) >= 0).withMessage('Paid amount cannot be negative'),
  body('paymentMethod')
    .optional().isIn(['cash', 'upi', 'card', 'bank']).withMessage('Invalid payment method'),
  body('paymentDate')
    .optional().isISO8601().withMessage('Invalid date format'),
];

module.exports = { createPaymentRules, updatePaymentRules };
