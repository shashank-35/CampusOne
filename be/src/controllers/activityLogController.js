const ActivityLog = require('../models/ActivityLog');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get activity logs (admin only)
// @route   GET /api/activity-logs
const getLogs = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page, 10)  || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.module) filter.module = req.query.module;
  if (req.query.user)   filter.user   = req.query.user;

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate('user', 'firstName lastName email role')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    ActivityLog.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Activity logs retrieved', logs, 200, {
    page, limit, total, pages: Math.ceil(total / limit),
  });
});

module.exports = { getLogs };
