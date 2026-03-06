const express = require('express');
const router = express.Router();
const {
  getStats, getMonthlyInquiries, getInquiryStatusBreakdown, getRecentInquiries,
  getPaymentStats, getMonthlyRevenue,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats',             getStats);
router.get('/monthly-inquiries', getMonthlyInquiries);
router.get('/inquiry-status',    getInquiryStatusBreakdown);
router.get('/recent-inquiries',  getRecentInquiries);
router.get('/payment-stats',     getPaymentStats);
router.get('/monthly-revenue',   getMonthlyRevenue);

module.exports = router;
