const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    console.log("🚀 ~ validate ~ next:",typeof next)
    await Promise.all(validations.map((v) => v.run(req)));

    const errors = validationResult(req);
    console.log("🚀 ~ validate ~ errors:", errors)
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: extractedErrors,
    });
  };
};

module.exports = { validate };
