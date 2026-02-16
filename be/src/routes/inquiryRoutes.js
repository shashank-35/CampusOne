const express = require('express');
const router = express.Router();
const { getInquiries, getInquiry, createInquiry, updateInquiry, deleteInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { createInquiryRules, updateInquiryRules } = require('../validators/inquiryValidator');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'head', 'staff'), getInquiries)
  .post(authorize('admin', 'head', 'staff'), validate(createInquiryRules), createInquiry);

router
  .route('/:id')
  .get(authorize('admin', 'head', 'staff'), getInquiry)
  .put(authorize('admin', 'head', 'staff'), validate(updateInquiryRules), updateInquiry)
  .delete(authorize('admin', 'head'), deleteInquiry);

module.exports = router;
