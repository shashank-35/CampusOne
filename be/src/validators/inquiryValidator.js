const { body } = require('express-validator');

const createInquiryRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ min: 2 }).withMessage('Min 2 characters'),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ min: 2 }).withMessage('Min 2 characters'),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Please provide a valid email'),
  body('mobile').optional({ checkFalsy: true }).isLength({ min: 10, max: 10 }).withMessage('Mobile must be 10 digits'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('techBackground').optional().isIn(['tech', 'non-tech']).withMessage('Invalid tech background'),
  body('sourceOfInquiry').optional().isIn(['website', 'reference', 'social', 'walk-in', 'qr-code']).withMessage('Invalid source'),
  body('status').optional().isIn(['new', 'contacted', 'interested', 'admission-done', 'not-interested', 'closed']).withMessage('Invalid status'),
];

const updateInquiryRules = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Please provide a valid email'),
  body('mobile').optional({ checkFalsy: true }).isLength({ min: 10, max: 10 }).withMessage('Mobile must be 10 digits'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('techBackground').optional().isIn(['tech', 'non-tech']).withMessage('Invalid tech background'),
  body('sourceOfInquiry').optional().isIn(['website', 'reference', 'social', 'walk-in', 'qr-code']).withMessage('Invalid source'),
  body('status').optional().isIn(['new', 'contacted', 'interested', 'admission-done', 'not-interested', 'closed']).withMessage('Invalid status'),
];

module.exports = { createInquiryRules, updateInquiryRules };
