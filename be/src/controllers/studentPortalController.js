const Student   = require('../models/Student');
const Course    = require('../models/Course');
const Admission = require('../models/Admission');
const Event     = require('../models/Event');
const Inquiry   = require('../models/Inquiry');
const User      = require('../models/User');
const ApiError    = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Student dashboard stats
// @route   GET /api/student-portal/dashboard
const getStudentDashboard = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  const [coursesCount, upcomingEventsCount, inquiry] = await Promise.all([
    Course.countDocuments({ status: 'active' }),
    Event.countDocuments({ status: 'upcoming', date: { $gte: new Date() } }),
    student
      ? Inquiry.findOne({ convertedStudent: student._id })
          .populate('assignedTo', 'firstName lastName')
          .select('status followUpDate assignedTo interestedArea')
      : null,
  ]);

  ApiResponse.success(res, 'Dashboard data retrieved', {
    coursesCount,
    upcomingEventsCount,
    inquiry,
    studentName: `${req.user.firstName} ${req.user.lastName}`,
  });
});

// @desc    Get student profile (User + Student record)
// @route   GET /api/student-portal/profile
const getStudentProfile = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  const user = await User.findById(req.user._id).select('-password');
  ApiResponse.success(res, 'Profile retrieved', { user, student });
});

// @desc    Update student profile
// @route   PUT /api/student-portal/profile
const updateStudentProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, mobileNumber, city, state, pincode, address } = req.body;

  // Update User name fields
  await User.findByIdAndUpdate(req.user._id, { firstName, lastName }, { runValidators: true });

  // Update Student record
  const student = await Student.findOneAndUpdate(
    { user: req.user._id },
    { mobileNumber, city, state, pincode, address },
    { new: true, runValidators: true }
  );

  ApiResponse.success(res, 'Profile updated successfully', { student });
});

// @desc    Change student password
// @route   PUT /api/student-portal/password
const changeStudentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current and new password are required');
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

// @desc    Get student's enrolled courses (from admission records)
// @route   GET /api/student-portal/courses
const getStudentCourses = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    return ApiResponse.success(res, 'Courses retrieved', []);
  }

  const admissions = await Admission.find({ studentId: student._id })
    .populate('courseId', '-handbook -topicSheet -createdBy')
    .sort('-createdAt');

  const courses = admissions
    .filter((a) => a.courseId)
    .map((a) => ({
      ...a.courseId.toObject(),
      batch: a.batch || null,
      enrolledOn: a.admissionDate || a.createdAt,
      admissionStatus: a.status,
      paymentStatus: a.paymentStatus,
    }));

  ApiResponse.success(res, 'Courses retrieved', courses);
});

// @desc    Get upcoming events (student view)
// @route   GET /api/student-portal/events
const getStudentEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({
    status: { $in: ['upcoming', 'ongoing'] },
  })
    .select('-createdBy')
    .sort('date')
    .limit(30);
  ApiResponse.success(res, 'Events retrieved', events);
});

// @desc    Get student's own inquiry status
// @route   GET /api/student-portal/inquiry
const getStudentInquiry = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) {
    return ApiResponse.success(res, 'No student record found', null);
  }

  const inquiry = await Inquiry.findOne({ convertedStudent: student._id })
    .populate('assignedTo', 'firstName lastName email')
    .populate('notes.addedBy', 'firstName lastName')
    .select('status followUpDate assignedTo notes createdAt interestedArea sourceOfInquiry firstName lastName');

  ApiResponse.success(res, 'Inquiry retrieved', inquiry);
});

module.exports = {
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
  changeStudentPassword,
  getStudentCourses,
  getStudentEvents,
  getStudentInquiry,
};
