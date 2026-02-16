const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });
};

// @desc    Register user
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  const user = await User.create({ firstName, lastName, email, password, role });

  const token = generateToken(user._id);
  const userData = user.toObject();
  delete userData.password;

  ApiResponse.success(res, 'User registered successfully', { user: userData, token }, 201);
});

// @desc    Login user
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new ApiError(401, 'Account is inactive');
  }

  const token = generateToken(user._id);
  const userData = user.toObject();
  delete userData.password;

  ApiResponse.success(res, 'Login successful', { user: userData, token });
});

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  ApiResponse.success(res, 'Logged out successfully');
});

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  ApiResponse.success(res, 'Current user retrieved', user);
});

module.exports = { register, login, logout, getMe };
