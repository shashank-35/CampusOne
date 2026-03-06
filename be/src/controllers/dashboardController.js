const Student   = require('../models/Student');
const Course    = require('../models/Course');
const Event     = require('../models/Event');
const Inquiry   = require('../models/Inquiry');
const Product   = require('../models/Product');
const User      = require('../models/User');
const Admission = require('../models/Admission');
const Payment   = require('../models/Payment');
const ApiResponse  = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
const getStats = asyncHandler(async (req, res) => {
  const today     = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalStudents, totalCourses, upcomingEvents,
    newInquiries, totalProducts, totalUsers,
    todayInquiries, admissionDone,
    totalAdmissions, admissionsThisMonth,
    totalInquiries,
  ] = await Promise.all([
    Student.countDocuments(),
    Course.countDocuments(),
    Event.countDocuments({ status: 'upcoming' }),
    Inquiry.countDocuments({ status: 'new' }),
    Product.countDocuments(),
    User.countDocuments({ role: { $ne: 'student' } }),
    Inquiry.countDocuments({ createdAt: { $gte: today } }),
    Inquiry.countDocuments({ status: 'admission-done' }),
    Admission.countDocuments(),
    Admission.countDocuments({ createdAt: { $gte: monthStart } }),
    Inquiry.countDocuments(),
  ]);

  // Top course by admissions
  const topCourseResult = await Admission.aggregate([
    { $match: { courseName: { $exists: true, $ne: '' } } },
    { $group: { _id: '$courseName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);
  const topCourse = topCourseResult[0]?._id || null;

  // Conversion rate: admissions / total inquiries
  const conversionRate = totalInquiries > 0
    ? Math.round((totalAdmissions / totalInquiries) * 100)
    : 0;

  ApiResponse.success(res, 'Dashboard stats retrieved', {
    totalStudents, totalCourses, upcomingEvents,
    newInquiries, totalProducts, totalUsers,
    todayInquiries, admissionDone,
    totalAdmissions, admissionsThisMonth,
    conversionRate, topCourse,
  });
});

// @desc    Monthly inquiry count for the last 6 months (for chart)
// @route   GET /api/dashboard/monthly-inquiries
const getMonthlyInquiries = asyncHandler(async (req, res) => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }

  const result = await Inquiry.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 5, 1)),
        },
      },
    },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
  ]);

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data = months.map(({ year, month }) => {
    const found = result.find((r) => r._id.year === year && r._id.month === month);
    return { month: monthNames[month - 1], year, count: found ? found.count : 0 };
  });

  ApiResponse.success(res, 'Monthly inquiries retrieved', data);
});

// @desc    Inquiry status breakdown (for pie/bar chart)
// @route   GET /api/dashboard/inquiry-status
const getInquiryStatusBreakdown = asyncHandler(async (req, res) => {
  const result = await Inquiry.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const data = result.map((r) => ({ status: r._id, count: r.count }));
  ApiResponse.success(res, 'Inquiry status breakdown retrieved', data);
});

// @desc    Recent activity (latest 10 inquiries)
// @route   GET /api/dashboard/recent-inquiries
const getRecentInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find()
    .sort('-createdAt')
    .limit(10)
    .populate('assignedTo', 'firstName lastName');

  ApiResponse.success(res, 'Recent inquiries retrieved', inquiries);
});

// @desc  Payment analytics summary
// @route GET /api/dashboard/payment-stats
const getPaymentStats = asyncHandler(async (req, res) => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [totals, thisMonth, pending, methodBreakdown] = await Promise.all([
    Payment.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$paidAmount' }, totalPending: { $sum: '$remainingAmount' } } },
    ]),
    Payment.aggregate([
      { $match: { paymentDate: { $gte: monthStart } } },
      { $group: { _id: null, amount: { $sum: '$paidAmount' } } },
    ]),
    Payment.countDocuments({ status: { $in: ['pending', 'partial'] } }),
    Payment.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, amount: { $sum: '$paidAmount' } } },
    ]),
  ]);

  ApiResponse.success(res, 'Payment stats retrieved', {
    totalRevenue:       totals[0]?.totalRevenue    || 0,
    totalPending:       totals[0]?.totalPending    || 0,
    thisMonthRevenue:   thisMonth[0]?.amount       || 0,
    pendingCount:       pending,
    methodBreakdown:    methodBreakdown.map((m) => ({ method: m._id, count: m.count, amount: m.amount })),
  });
});

// @desc  Monthly revenue for last 6 months
// @route GET /api/dashboard/monthly-revenue
const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }

  const result = await Payment.aggregate([
    {
      $match: {
        paymentDate: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 5, 1)),
        },
      },
    },
    {
      $group: {
        _id:     { year: { $year: '$paymentDate' }, month: { $month: '$paymentDate' } },
        revenue: { $sum: '$paidAmount' },
        count:   { $sum: 1 },
      },
    },
  ]);

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data = months.map(({ year, month }) => {
    const found = result.find((r) => r._id.year === year && r._id.month === month);
    return {
      month: monthNames[month - 1],
      year,
      revenue: found ? found.revenue : 0,
      count:   found ? found.count   : 0,
    };
  });

  ApiResponse.success(res, 'Monthly revenue retrieved', data);
});

module.exports = {
  getStats,
  getMonthlyInquiries,
  getInquiryStatusBreakdown,
  getRecentInquiries,
  getPaymentStats,
  getMonthlyRevenue,
};
