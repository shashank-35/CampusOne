const { body } = require('express-validator');

const createInquiryRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('sourceOfInquiry').optional().isIn(['website', 'reference', 'social']).withMessage('Invalid source'),
  body('email').optional().trim().isEmail().withMessage('Please provide a valid email'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('techBackground').optional().isIn(['tech', 'non-tech']).withMessage('Invalid tech background'),
  body('status').optional().isIn(['new', 'contacted', 'resolved', 'closed']).withMessage('Invalid status'),
];

const updateInquiryRules = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('sourceOfInquiry').optional().isIn(['website', 'reference', 'social']).withMessage('Invalid source'),
  body('email').optional().trim().isEmail().withMessage('Please provide a valid email'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('techBackground').optional().isIn(['tech', 'non-tech']).withMessage('Invalid tech background'),
  body('status').optional().isIn(['new', 'contacted', 'resolved', 'closed']).withMessage('Invalid status'),
];

module.exports = { createInquiryRules, updateInquiryRules };
