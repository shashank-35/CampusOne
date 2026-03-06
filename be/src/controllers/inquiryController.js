const Inquiry = require('../models/Inquiry');
const Student = require('../models/Student');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { sendInquiryConfirmation, sendInquiryAssignedEmail, sendStudentWelcomeEmail } = require('../services/emailService');

// Helper: push a notification
const pushNotification = async (userId, title, message, type = 'info', link = null) => {
  await Notification.create({ user: userId, title, message, type, link }).catch(() => {});
};

// @desc    Get all inquiries (with filters + pagination)
// @route   GET /api/inquiries
const getInquiries = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page, 10)  || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip  = (page - 1) * limit;
  const sort  = req.query.sort || '-createdAt';

  const filter = {};

  if (req.query.search) {
    const re = new RegExp(req.query.search, 'i');
    filter.$or = [{ firstName: re }, { lastName: re }, { email: re }, { mobile: re }];
  }
  if (req.query.status)          filter.status          = req.query.status;
  if (req.query.sourceOfInquiry) filter.sourceOfInquiry = req.query.sourceOfInquiry;
  if (req.query.assignedTo)      filter.assignedTo      = req.query.assignedTo;

  // Date range filter
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to)   filter.createdAt.$lte = new Date(new Date(req.query.to).setHours(23, 59, 59));
  }

  // Counselors only see their assigned inquiries
  if (req.user.role === 'counselor') {
    filter.assignedTo = req.user._id;
  }

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .populate('assignedTo', 'firstName lastName email')
      .populate('interestedCourse', 'title')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Inquiry.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Inquiries retrieved successfully', inquiries, 200, {
    page, limit, total, pages: Math.ceil(total / limit),
  });
});

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
const getInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id)
    .populate('assignedTo', 'firstName lastName email')
    .populate('interestedCourse', 'title')
    .populate('notes.addedBy', 'firstName lastName')
    .populate('convertedStudent', 'firstName lastName');

  if (!inquiry) throw new ApiError(404, 'Inquiry not found');
  ApiResponse.success(res, 'Inquiry retrieved successfully', inquiry);
});

// @desc    Create inquiry (internal — requires auth)
// @route   POST /api/inquiries
const createInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.create(req.body);

  // Send confirmation email to student
  if (inquiry.email) {
    sendInquiryConfirmation({
      name: `${inquiry.firstName} ${inquiry.lastName}`,
      email: inquiry.email,
    }).catch(() => {});
  }

  // Notify all receptionists
  const receptionists = await User.find({ role: 'receptionist', status: 'active' });
  receptionists.forEach((r) => {
    pushNotification(
      r._id,
      'New Inquiry Received',
      `${inquiry.firstName} ${inquiry.lastName} submitted an inquiry.`,
      'info',
      '/inquiry'
    );
  });

  ApiResponse.success(res, 'Inquiry created successfully', inquiry, 201);
});

// @desc    Public inquiry form submission (no auth)
// @route   POST /api/inquiries/public
const publicCreateInquiry = asyncHandler(async (req, res) => {
  const data = { ...req.body, sourceOfInquiry: req.body.sourceOfInquiry || 'qr-code' };
  const inquiry = await Inquiry.create(data);

  // Send confirmation email
  if (inquiry.email) {
    sendInquiryConfirmation({
      name: `${inquiry.firstName} ${inquiry.lastName}`,
      email: inquiry.email,
    }).catch(() => {});
  }

  // Notify receptionists
  const receptionists = await User.find({ role: 'receptionist', status: 'active' });
  receptionists.forEach((r) => {
    pushNotification(
      r._id,
      'New Public Inquiry',
      `${inquiry.firstName} ${inquiry.lastName} submitted a public inquiry.`,
      'info',
      '/inquiry'
    );
  });

  ApiResponse.success(res, 'Inquiry submitted successfully. We will contact you shortly.', inquiry, 201);
});

// @desc    Update inquiry
// @route   PUT /api/inquiries/:id
const updateInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  }).populate('assignedTo', 'firstName lastName email');

  if (!inquiry) throw new ApiError(404, 'Inquiry not found');
  ApiResponse.success(res, 'Inquiry updated successfully', inquiry);
});

// @desc    Delete inquiry (Admin/Counselor only)
// @route   DELETE /api/inquiries/:id
const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');
  await inquiry.deleteOne();
  ApiResponse.success(res, 'Inquiry deleted successfully');
});

// @desc    Assign inquiry to a counselor
// @route   PUT /api/inquiries/:id/assign
const assignInquiry = asyncHandler(async (req, res) => {
  const { counselorId } = req.body;
  if (!counselorId) throw new ApiError(400, 'Counselor ID is required');

  const counselor = await User.findById(counselorId);
  if (!counselor || counselor.role !== 'counselor') throw new ApiError(400, 'Invalid counselor');

  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { assignedTo: counselorId, status: 'contacted' },
    { new: true }
  ).populate('assignedTo', 'firstName lastName email');

  if (!inquiry) throw new ApiError(404, 'Inquiry not found');

  // Notify counselor
  pushNotification(
    counselorId,
    'Inquiry Assigned to You',
    `${inquiry.firstName} ${inquiry.lastName} has been assigned to you.`,
    'info',
    '/inquiry'
  );

  // Send email to counselor
  sendInquiryAssignedEmail({
    counselorEmail: counselor.email,
    counselorName: `${counselor.firstName} ${counselor.lastName}`,
    studentName: `${inquiry.firstName} ${inquiry.lastName}`,
  }).catch(() => {});

  ApiResponse.success(res, 'Inquiry assigned successfully', inquiry);
});

// @desc    Add a note to inquiry
// @route   POST /api/inquiries/:id/notes
const addNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) throw new ApiError(400, 'Note text is required');

  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');

  inquiry.notes.push({ text, addedBy: req.user._id });
  await inquiry.save();

  await inquiry.populate('notes.addedBy', 'firstName lastName');
  ApiResponse.success(res, 'Note added successfully', inquiry.notes);
});

// @desc    Convert inquiry to student record + create student User account
// @route   POST /api/inquiries/:id/convert
const convertToStudent = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');
  if (inquiry.convertedStudent) throw new ApiError(400, 'Inquiry already converted to student');

  // Generate a temporary password
  const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';

  // Create User account with role 'student' (only if email exists)
  let studentUser = null;
  if (inquiry.email) {
    const existingUser = await User.findOne({ email: inquiry.email });
    if (!existingUser) {
      studentUser = await User.create({
        firstName: inquiry.firstName,
        lastName:  inquiry.lastName,
        email:     inquiry.email,
        password:  tempPassword,
        role:      'student',
        status:    'active',
      });
    } else {
      studentUser = existingUser;
    }
  }

  // Create student record from inquiry data
  const studentData = {
    firstName:    inquiry.firstName,
    lastName:     inquiry.lastName,
    email:        inquiry.email,
    mobileNumber: inquiry.mobile,
    dateOfBirth:  inquiry.dateOfBirth,
    gender:       inquiry.gender,
    address:      [inquiry.addressLine1, inquiry.addressLine2].filter(Boolean).join(', '),
    city:         inquiry.city,
    state:        inquiry.state,
    pincode:      inquiry.pincode,
    background:   inquiry.techBackground,
    status:       'active',
    user:         studentUser?._id || null,
  };

  const student = await Student.create(studentData);

  inquiry.convertedStudent = student._id;
  inquiry.status = 'admission-done';
  await inquiry.save();

  // Send welcome email with credentials
  if (inquiry.email && studentUser) {
    sendStudentWelcomeEmail({
      name:     `${inquiry.firstName} ${inquiry.lastName}`,
      email:    inquiry.email,
      password: tempPassword,
    }).catch(() => {});
  }

  // Notify admin
  const admin = await User.findOne({ role: 'admin' });
  if (admin) {
    pushNotification(
      admin._id,
      'Inquiry Converted to Student',
      `${inquiry.firstName} ${inquiry.lastName} has been admitted as a student.`,
      'success',
      '/student'
    );
  }

  ApiResponse.success(res, 'Inquiry converted to student successfully', { inquiry, student }, 201);
});

module.exports = {
  getInquiries, getInquiry, createInquiry, publicCreateInquiry,
  updateInquiry, deleteInquiry, assignInquiry, addNote, convertToStudent,
};
