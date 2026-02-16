const Student = require('../models/Student');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all students
// @route   GET /api/students
const getStudents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = {};
  if (req.query.search) {
    const search = new RegExp(req.query.search, 'i');
    filter.$or = [{ firstName: search }, { lastName: search }, { email: search }];
  }
  if (req.query.status) filter.status = req.query.status;
  if (req.query.background) filter.background = req.query.background;

  const [students, total] = await Promise.all([
    Student.find(filter).populate('user', 'firstName lastName email').sort(sort).skip(skip).limit(limit),
    Student.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Students retrieved successfully', students, 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Get single student
// @route   GET /api/students/:id
const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate('user', 'firstName lastName email');
  if (!student) throw new ApiError(404, 'Student not found');
  ApiResponse.success(res, 'Student retrieved successfully', student);
});

// @desc    Create student
// @route   POST /api/students
const createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);
  ApiResponse.success(res, 'Student created successfully', student, 201);
});

// @desc    Update student
// @route   PUT /api/students/:id
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!student) throw new ApiError(404, 'Student not found');
  ApiResponse.success(res, 'Student updated successfully', student);
});

// @desc    Delete student
// @route   DELETE /api/students/:id
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, 'Student not found');
  await student.deleteOne();
  ApiResponse.success(res, 'Student deleted successfully');
});

module.exports = { getStudents, getStudent, createStudent, updateStudent, deleteStudent };
