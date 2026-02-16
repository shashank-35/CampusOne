const { body } = require('express-validator');

const createTodoRules = [
  body('todo').trim().notEmpty().withMessage('Todo text is required'),
  body('important').optional().isBoolean().withMessage('Important must be a boolean'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('category').optional().isIn(['work', 'personal', 'study']).withMessage('Invalid category'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status'),
];

const updateTodoRules = [
  body('todo').optional().trim().notEmpty().withMessage('Todo text cannot be empty'),
  body('important').optional().isBoolean().withMessage('Important must be a boolean'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('category').optional().isIn(['work', 'personal', 'study']).withMessage('Invalid category'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status'),
];

module.exports = { createTodoRules, updateTodoRules };
