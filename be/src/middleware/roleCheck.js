const ApiError = require('../utils/ApiError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log("🚀 ~ authorize ~ req.user.role:=====>", req.user.role)
      throw new ApiError(403, `Role '${req.user.role}' is not authorized to access this resource`);
    }
    next();
  };
};

module.exports = { authorize };
