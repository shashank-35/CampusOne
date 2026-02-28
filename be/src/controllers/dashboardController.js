const Student = require('../models/Student');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const [totalStudents, totalCourses, upcomingEvents, newInquiries, totalProducts, totalUsers] =
    await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Event.countDocuments({ status: 'upcoming' }),
      Inquiry.countDocuments({ status: 'new' }),
      Product.countDocuments(),
      User.countDocuments(),
    ]);

  ApiResponse.success(res, 'Dashboard stats retrieved', {
    totalStudents,
    totalCourses,
    upcomingEvents,
    newInquiries,
    totalProducts,
    totalUsers,
  });
});

module.exports = { getStats };
