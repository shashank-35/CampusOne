const express = require('express');
const router = express.Router();
const { generateInquiryQR } = require('../controllers/qrController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.get('/inquiry-form', authorize('admin'), generateInquiryQR);

module.exports = router;
