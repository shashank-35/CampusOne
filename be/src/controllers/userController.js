const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all users
// @route   GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = {};
  if (req.query.search) {
    const search = new RegExp(req.query.search, 'i');
    filter.$or = [{ firstName: search }, { lastName: search }, { email: search }];
  }
  if (req.query.role) filter.role = req.query.role;
  if (req.query.status) filter.status = req.query.status;

  const [users, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Users retrieved successfully', users, 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  ApiResponse.success(res, 'User retrieved successfully', user);
});

// @desc    Create user
// @route   POST /api/users
const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  const userData = user.toObject();
  delete userData.password;
  ApiResponse.success(res, 'User created successfully', userData, 201);
});

// @desc    Update user
// @route   PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  // If password is being updated, let the pre-save hook handle hashing
  Object.assign(user, req.body);
  await user.save();

  const userData = user.toObject();
  delete userData.password;
  ApiResponse.success(res, 'User updated successfully', userData);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  await user.deleteOne();
  ApiResponse.success(res, 'User deleted successfully');
});

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
