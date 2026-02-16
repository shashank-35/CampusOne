class ApiResponse {
  static success(res, message, data = null, statusCode = 200, pagination = null) {
    const response = { success: true, message };
    if (data !== null) response.data = data;
    if (pagination) response.pagination = pagination;
    return res.status(statusCode).json(response);
  }

  static error(res, message, statusCode = 500, errors = []) {
    const response = { success: false, message };
    if (errors.length) response.errors = errors;
    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
