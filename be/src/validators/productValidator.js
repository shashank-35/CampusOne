const { body } = require('express-validator');

const createProductRules = [
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('receiveCount').optional().isInt({ min: 0 }).withMessage('Receive count must be a non-negative integer'),
  body('missing').optional().isInt({ min: 0 }).withMessage('Missing must be a non-negative integer'),
  body('availableCount').optional().isInt({ min: 0 }).withMessage('Available count must be a non-negative integer'),
];

const updateProductRules = [
  body('productName').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('receiveCount').optional().isInt({ min: 0 }).withMessage('Receive count must be a non-negative integer'),
  body('missing').optional().isInt({ min: 0 }).withMessage('Missing must be a non-negative integer'),
  body('availableCount').optional().isInt({ min: 0 }).withMessage('Available count must be a non-negative integer'),
];

module.exports = { createProductRules, updateProductRules };
