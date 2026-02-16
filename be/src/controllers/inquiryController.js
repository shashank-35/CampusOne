const Inquiry = require('../models/Inquiry');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all inquiries
// @route   GET /api/inquiries
const getInquiries = asyncHandler(async (req, res) => {
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
  if (req.query.sourceOfInquiry) filter.sourceOfInquiry = req.query.sourceOfInquiry;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter).populate('assignTo', 'firstName lastName').sort(sort).skip(skip).limit(limit),
    Inquiry.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Inquiries retrieved successfully', inquiries, 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
const getInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id).populate('assignTo', 'firstName lastName');
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');
  ApiResponse.success(res, 'Inquiry retrieved successfully', inquiry);
});

// @desc    Create inquiry
// @route   POST /api/inquiries
const createInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.create(req.body);
  ApiResponse.success(res, 'Inquiry created successfully', inquiry, 201);
});

// @desc    Update inquiry
// @route   PUT /api/inquiries/:id
const updateInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');
  ApiResponse.success(res, 'Inquiry updated successfully', inquiry);
});

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');
  await inquiry.deleteOne();
  ApiResponse.success(res, 'Inquiry deleted successfully');
});

module.exports = { getInquiries, getInquiry, createInquiry, updateInquiry, deleteInquiry };
