const ActivityLog = require('../models/ActivityLog');

/**
 * Middleware factory — logs an activity after a successful response.
 * Usage: router.post('/', protect, logActivity('CREATE', 'Inquiry', 'Created new inquiry'), createInquiry)
 */
const logActivity = (action, module, description) => {
  return (req, res, next) => {
    res.on('finish', () => {
      if (req.user && res.statusCode < 400) {
        ActivityLog.create({
          user: req.user._id,
          action,
          module,
          description,
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.get('user-agent'),
        }).catch(() => {}); // Non-blocking — never fail the request because of logging
      }
    });
    next();
  };
};

module.exports = { logActivity };
