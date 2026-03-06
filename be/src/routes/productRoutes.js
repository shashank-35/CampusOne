const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { createProductRules, updateProductRules } = require('../validators/productValidator');

router.use(protect);

router
  .route('/')
  .get(authorize('admin'), getProducts)
  .post(authorize('admin'), validate(createProductRules), createProduct);

router
  .route('/:id')
  .get(authorize('admin'), getProduct)
  .put(authorize('admin'), validate(updateProductRules), updateProduct)
  .delete(authorize('admin'), deleteProduct);

module.exports = router;
