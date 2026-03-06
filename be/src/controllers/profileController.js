const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get current user profile
// @route   GET /api/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  ApiResponse.success(res, 'Profile retrieved', user);
});

// @desc    Update current user profile
// @route   PUT /api/profile
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'firstName', 'lastName', 'dateOfBirth', 'gender',
    'mobileNumber', 'addressLine1', 'addressLine2', 'city', 'state', 'pincode',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  ApiResponse.success(res, 'Profile updated successfully', user);
});

// @desc    Change password
// @route   PUT /api/profile/password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required');
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();

  ApiResponse.success(res, 'Password changed successfully');
});

// @desc    Upload profile image
// @route   PUT /api/profile/image
const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file uploaded');

  const imageUrl = `/uploads/profiles/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage: imageUrl },
    { new: true }
  );

  ApiResponse.success(res, 'Profile image updated', { profileImage: user.profileImage });
});

module.exports = { getProfile, updateProfile, changePassword, uploadProfileImage };
