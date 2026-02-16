const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all courses
// @route   GET /api/courses
const getCourses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = {};
  if (req.query.search) {
    const search = new RegExp(req.query.search, 'i');
    filter.$or = [{ title: search }, { description: search }];
  }
  if (req.query.status) filter.status = req.query.status;

  const [courses, total] = await Promise.all([
    Course.find(filter).populate('createdBy', 'firstName lastName').sort(sort).skip(skip).limit(limit),
    Course.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Courses retrieved successfully', courses, 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('createdBy', 'firstName lastName');
  if (!course) throw new ApiError(404, 'Course not found');
  ApiResponse.success(res, 'Course retrieved successfully', course);
});

// @desc    Create course
// @route   POST /api/courses
const createCourse = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user._id;

  if (req.files) {
    if (req.files.handbook) req.body.handbook = req.files.handbook[0].filename;
    if (req.files.topicSheet) req.body.topicSheet = req.files.topicSheet[0].filename;
  }

  const course = await Course.create(req.body);
  ApiResponse.success(res, 'Course created successfully', course, 201);
});

// @desc    Update course
// @route   PUT /api/courses/:id
const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');

  if (req.files) {
    if (req.files.handbook) {
      // Delete old file
      if (course.handbook) {
        const oldPath = path.join(__dirname, '../../uploads/courses', course.handbook);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      req.body.handbook = req.files.handbook[0].filename;
    }
    if (req.files.topicSheet) {
      if (course.topicSheet) {
        const oldPath = path.join(__dirname, '../../uploads/courses', course.topicSheet);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      req.body.topicSheet = req.files.topicSheet[0].filename;
    }
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ApiResponse.success(res, 'Course updated successfully', course);
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');

  // Delete associated files
  if (course.handbook) {
    const hPath = path.join(__dirname, '../../uploads/courses', course.handbook);
    if (fs.existsSync(hPath)) fs.unlinkSync(hPath);
  }
  if (course.topicSheet) {
    const tPath = path.join(__dirname, '../../uploads/courses', course.topicSheet);
    if (fs.existsSync(tPath)) fs.unlinkSync(tPath);
  }

  await course.deleteOne();
  ApiResponse.success(res, 'Course deleted successfully');
});

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse };
