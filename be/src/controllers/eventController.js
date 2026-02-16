const Event = require('../models/Event');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all events
// @route   GET /api/events
const getEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = {};
  if (req.query.search) {
    const search = new RegExp(req.query.search, 'i');
    filter.$or = [{ title: search }, { description: search }, { host: search }];
  }
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;

  const [events, total] = await Promise.all([
    Event.find(filter).populate('createdBy', 'firstName lastName').sort(sort).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Events retrieved successfully', events, 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('createdBy', 'firstName lastName');
  if (!event) throw new ApiError(404, 'Event not found');
  ApiResponse.success(res, 'Event retrieved successfully', event);
});

// @desc    Create event
// @route   POST /api/events
const createEvent = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user._id;
  const event = await Event.create(req.body);
  ApiResponse.success(res, 'Event created successfully', event, 201);
});

// @desc    Update event
// @route   PUT /api/events/:id
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) throw new ApiError(404, 'Event not found');
  ApiResponse.success(res, 'Event updated successfully', event);
});

// @desc    Delete event
// @route   DELETE /api/events/:id
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  await event.deleteOne();
  ApiResponse.success(res, 'Event deleted successfully');
});

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
