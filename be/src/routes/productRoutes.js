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
  .get(authorize('admin', 'head', 'staff'), getProducts)
  .post(authorize('admin', 'head', 'staff'), validate(createProductRules), createProduct);

router
  .route('/:id')
  .get(authorize('admin', 'head', 'staff'), getProduct)
  .put(authorize('admin', 'head', 'staff'), validate(updateProductRules), updateProduct)
  .delete(authorize('admin', 'head'), deleteProduct);

module.exports = router;
