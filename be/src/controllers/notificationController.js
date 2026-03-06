const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get notifications for the current user
// @route   GET /api/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort('-createdAt')
    .limit(50);

  const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

  ApiResponse.success(res, 'Notifications retrieved', { notifications, unreadCount });
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
const markRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true }
  );
  ApiResponse.success(res, 'Notification marked as read');
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  ApiResponse.success(res, 'All notifications marked as read');
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  ApiResponse.success(res, 'Notification deleted');
});

module.exports = { getNotifications, markRead, markAllRead, deleteNotification };
