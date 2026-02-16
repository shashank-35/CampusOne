const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all products
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = {};
  if (req.query.search) {
    const search = new RegExp(req.query.search, 'i');
    filter.$or = [{ productName: search }, { description: search }];
  }
  if (req.query.status) filter.status = req.query.status;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Products retrieved successfully', products, 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  ApiResponse.success(res, 'Product retrieved successfully', product);
});

// @desc    Create product
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  ApiResponse.success(res, 'Product created successfully', product, 201);
});

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  // Use save() so the pre-save hook recalculates status
  Object.assign(product, req.body);
  await product.save();

  ApiResponse.success(res, 'Product updated successfully', product);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  await product.deleteOne();
  ApiResponse.success(res, 'Product deleted successfully');
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
