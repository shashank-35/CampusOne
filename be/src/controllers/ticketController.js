const Ticket       = require('../models/Ticket');
const User         = require('../models/User');
const Notification = require('../models/Notification');
const ApiError     = require('../utils/ApiError');
const ApiResponse  = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Student submits a support ticket
// @route   POST /api/tickets
const createTicket = asyncHandler(async (req, res) => {
  const { category, subject, message } = req.body;

  if (!category || !subject || !message) {
    throw new ApiError(400, 'Category, subject, and message are required');
  }

  const ticket = await Ticket.create({
    student: req.user._id,
    category,
    subject,
    message,
  });

  // Notify admin and all active counselors
  const staff = await User.find(
    { role: { $in: ['admin', 'counselor'] }, status: 'active' },
    '_id'
  );

  if (staff.length) {
    await Notification.insertMany(
      staff.map((u) => ({
        user:    u._id,
        title:   'New Support Ticket',
        message: `${req.user.firstName} ${req.user.lastName} submitted: "${subject}"`,
        type:    'info',
      }))
    );
  }

  ApiResponse.success(res, 'Ticket submitted successfully', ticket, 201);
});

// @desc    Admin/Counselor gets all tickets
// @route   GET /api/tickets
const getTickets = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;

  // Counselors see tickets assigned to them OR unassigned
  if (req.user.role === 'counselor') {
    filter.$or = [{ assignedTo: req.user._id }, { assignedTo: null }];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate('student',    'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .populate('repliedBy',  'firstName lastName')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Ticket.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Tickets retrieved', tickets, 200, {
    total,
    page:  Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// @desc    Student gets their own tickets
// @route   GET /api/student-portal/tickets
const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ student: req.user._id })
    .populate('assignedTo', 'firstName lastName')
    .populate('repliedBy',  'firstName lastName')
    .sort('-createdAt');

  ApiResponse.success(res, 'Tickets retrieved', tickets);
});

// @desc    Admin/Counselor updates a ticket (status, assignedTo, reply)
// @route   PUT /api/tickets/:id
const updateTicket = asyncHandler(async (req, res) => {
  const { status, assignedTo, reply } = req.body;

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  if (status)              ticket.status     = status;
  if (assignedTo !== undefined) ticket.assignedTo = assignedTo || null;

  if (reply) {
    ticket.reply      = reply;
    ticket.repliedBy  = req.user._id;
    ticket.repliedAt  = new Date();
    if (ticket.status === 'open') ticket.status = 'in-progress';

    // Notify the student about the reply
    await Notification.create({
      user:    ticket.student,
      title:   'Support Ticket Reply',
      message: `Your ticket "${ticket.subject}" has a new reply.`,
      type:    'info',
    });
  }

  await ticket.save();

  await ticket.populate([
    { path: 'student',    select: 'firstName lastName email' },
    { path: 'assignedTo', select: 'firstName lastName' },
    { path: 'repliedBy',  select: 'firstName lastName' },
  ]);

  ApiResponse.success(res, 'Ticket updated', ticket);
});

module.exports = { createTicket, getTickets, getMyTickets, updateTicket };
