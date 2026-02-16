const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token');
  }

  const decoded = jwt.verify(token, config.jwtSecret);
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    throw new ApiError(401, 'Not authorized, user not found');
  }

  if (req.user.status !== 'active') {
    throw new ApiError(401, 'Account is inactive');
  }

  next();
});

module.exports = { protect };
