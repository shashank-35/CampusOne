const Todo = require('../models/Todo');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all todos (own only)
// @route   GET /api/todos
const getTodos = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = { user: req.user._id };
  if (req.query.search) {
    filter.todo = new RegExp(req.query.search, 'i');
  }
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.important !== undefined) filter.important = req.query.important === 'true';

  const [todos, total] = await Promise.all([
    Todo.find(filter).sort(sort).skip(skip).limit(limit),
    Todo.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Todos retrieved successfully', todos, 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Get single todo (own only)
// @route   GET /api/todos/:id
const getTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
  if (!todo) throw new ApiError(404, 'Todo not found');
  ApiResponse.success(res, 'Todo retrieved successfully', todo);
});

// @desc    Create todo
// @route   POST /api/todos
const createTodo = asyncHandler(async (req, res) => {
  req.body.user = req.user._id;
  const todo = await Todo.create(req.body);
  ApiResponse.success(res, 'Todo created successfully', todo, 201);
});

// @desc    Update todo (own only)
// @route   PUT /api/todos/:id
const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!todo) throw new ApiError(404, 'Todo not found');
  ApiResponse.success(res, 'Todo updated successfully', todo);
});

// @desc    Delete todo (own only)
// @route   DELETE /api/todos/:id
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!todo) throw new ApiError(404, 'Todo not found');
  ApiResponse.success(res, 'Todo deleted successfully');
});

module.exports = { getTodos, getTodo, createTodo, updateTodo, deleteTodo };
