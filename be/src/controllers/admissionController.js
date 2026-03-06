const Admission  = require('../models/Admission');
const Inquiry    = require('../models/Inquiry');
const Student    = require('../models/Student');
const User       = require('../models/User');
const Course     = require('../models/Course');
const Notification = require('../models/Notification');
const ApiError    = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { sendStudentWelcomeEmail } = require('../services/emailService');

const pushNotification = async (userId, title, message, type = 'info', link = null) => {
  await Notification.create({ user: userId, title, message, type, link }).catch(() => {});
};

// ── Helper: build documents object from uploaded files ──
const buildDocuments = (files = {}, existing = {}) => ({
  photo:     files.photo?.[0]     ? `/uploads/admissions/${files.photo[0].filename}`     : existing.photo     || null,
  idProof:   files.idProof?.[0]   ? `/uploads/admissions/${files.idProof[0].filename}`   : existing.idProof   || null,
  marksheet: files.marksheet?.[0] ? `/uploads/admissions/${files.marksheet[0].filename}` : existing.marksheet || null,
});

// @desc    Get all admissions (with filters + pagination)
// @route   GET /api/admissions
const getAdmissions = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip  = (page - 1) * limit;
  const sort  = req.query.sort || '-createdAt';

  const filter = {};
  if (req.query.status)        filter.status        = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  if (req.query.search) {
    const re = new RegExp(req.query.search, 'i');
    filter.$or = [{ studentName: re }, { email: re }, { mobile: re }, { courseName: re }];
  }
  if (req.query.from || req.query.to) {
    filter.admissionDate = {};
    if (req.query.from) filter.admissionDate.$gte = new Date(req.query.from);
    if (req.query.to)   filter.admissionDate.$lte = new Date(new Date(req.query.to).setHours(23, 59, 59));
  }

  const [admissions, total] = await Promise.all([
    Admission.find(filter)
      .populate('courseId', 'title')
      .populate('createdBy', 'firstName lastName')
      .populate('studentId', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Admission.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Admissions retrieved', admissions, 200, {
    page, limit, total, pages: Math.ceil(total / limit),
  });
});

// @desc    Get single admission
// @route   GET /api/admissions/:id
const getAdmission = asyncHandler(async (req, res) => {
  const admission = await Admission.findById(req.params.id)
    .populate('courseId', 'title duration fees')
    .populate('createdBy', 'firstName lastName email')
    .populate('studentId', 'firstName lastName')
    .populate('inquiryId', 'status assignedTo');

  if (!admission) throw new ApiError(404, 'Admission not found');
  ApiResponse.success(res, 'Admission retrieved', admission);
});

// @desc    Create admission manually
// @route   POST /api/admissions
const createAdmission = asyncHandler(async (req, res) => {
  const body = { ...req.body };

  // If courseId provided, fetch course name
  if (body.courseId && !body.courseName) {
    const course = await Course.findById(body.courseId);
    if (course) body.courseName = course.title;
  }

  body.documents = buildDocuments(req.files || {});
  body.createdBy = req.user._id;

  const admission = await Admission.create(body);

  // Notify admin
  const admin = await User.findOne({ role: 'admin' });
  if (admin) {
    pushNotification(
      admin._id,
      'New Admission Created',
      `${admission.studentName} has been admitted for ${admission.courseName}.`,
      'success',
      '/admission'
    );
  }

  ApiResponse.success(res, 'Admission created successfully', admission, 201);
});

// @desc    Update admission
// @route   PUT /api/admissions/:id
const updateAdmission = asyncHandler(async (req, res) => {
  const existing = await Admission.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Admission not found');

  const updates = { ...req.body };

  // If courseId changed, update courseName
  if (updates.courseId && updates.courseId !== String(existing.courseId)) {
    const course = await Course.findById(updates.courseId);
    if (course) updates.courseName = course.title;
  }

  // Merge uploaded files with existing
  updates.documents = buildDocuments(req.files || {}, existing.documents || {});

  // Re-compute finalFees if fees changed
  const totalFees = updates.totalFees !== undefined ? Number(updates.totalFees) : existing.totalFees;
  const discount  = updates.discount  !== undefined ? Number(updates.discount)  : existing.discount;
  updates.finalFees = Math.max(0, totalFees - discount);

  const admission = await Admission.findByIdAndUpdate(req.params.id, updates, {
    new: true, runValidators: true,
  })
    .populate('courseId', 'title')
    .populate('createdBy', 'firstName lastName');

  ApiResponse.success(res, 'Admission updated successfully', admission);
});

// @desc    Delete admission
// @route   DELETE /api/admissions/:id
const deleteAdmission = asyncHandler(async (req, res) => {
  const admission = await Admission.findById(req.params.id);
  if (!admission) throw new ApiError(404, 'Admission not found');
  await admission.deleteOne();
  ApiResponse.success(res, 'Admission deleted successfully');
});

// @desc    Convert inquiry → admission + create student record
// @route   POST /api/inquiries/:id/convert-admission
const convertInquiryToAdmission = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');

  // Check if already converted
  const existing = await Admission.findOne({ inquiryId: inquiry._id });
  if (existing) throw new ApiError(400, 'This inquiry is already converted to an admission');

  const { courseId, courseName, batch, totalFees, discount, paymentStatus, notes } = req.body;
  if (!totalFees) throw new ApiError(400, 'Total fees is required');

  // Resolve course name
  let resolvedCourseName = courseName;
  if (courseId && !resolvedCourseName) {
    const course = await Course.findById(courseId);
    if (course) resolvedCourseName = course.title;
  }

  // Create or find existing User account for student portal access
  const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
  let studentUser = null;
  let isNewUser = false;
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
      isNewUser = true;
    } else {
      studentUser = existingUser;
    }
  }

  // Create or find existing Student record
  let student = await Student.findOne({ email: inquiry.email });
  if (!student) {
    student = await Student.create({
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
    });
  } else if (!student.user && studentUser) {
    // Link user to existing student record if not already linked
    student.user = studentUser._id;
    await student.save();
  }

  // Create admission
  const finalFeesVal = Math.max(0, Number(totalFees) - Number(discount || 0));
  const admission = await Admission.create({
    studentName:   `${inquiry.firstName} ${inquiry.lastName}`,
    email:         inquiry.email,
    mobile:        inquiry.mobile,
    dateOfBirth:   inquiry.dateOfBirth,
    gender:        inquiry.gender,
    courseId:      courseId || null,
    courseName:    resolvedCourseName || '',
    batch:         batch || '',
    totalFees:     Number(totalFees),
    discount:      Number(discount || 0),
    finalFees:     finalFeesVal,
    paymentStatus: paymentStatus || 'pending',
    notes:         notes || '',
    documents:     buildDocuments(req.files || {}),
    inquiryId:     inquiry._id,
    studentId:     student._id,
    createdBy:     req.user._id,
    status:        'approved',
  });

  // Update inquiry status and link student
  inquiry.status           = 'admission-done';
  inquiry.convertedStudent = student._id;
  await inquiry.save();

  // Send welcome email with login credentials (only for newly created accounts)
  if (isNewUser && inquiry.email) {
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
      'Inquiry Converted to Admission',
      `${admission.studentName} — ${resolvedCourseName || 'N/A'} has been admitted.`,
      'success',
      '/admission'
    );
  }

  ApiResponse.success(
    res,
    'Inquiry converted to admission successfully',
    { admission, student },
    201
  );
});

module.exports = {
  getAdmissions,
  getAdmission,
  createAdmission,
  updateAdmission,
  deleteAdmission,
  convertInquiryToAdmission,
};
