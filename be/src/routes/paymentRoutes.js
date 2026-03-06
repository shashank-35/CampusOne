const express = require('express');
const router  = express.Router();
const { protect }   = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate }  = require('../middleware/validate');
const { createPaymentRules, updatePaymentRules } = require('../validators/paymentValidator');
const {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  downloadReceipt,
} = require('../controllers/paymentController');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'counselor', 'receptionist'),  getPayments)
  .post(authorize('admin', 'counselor', 'receptionist'), validate(createPaymentRules), createPayment);

router
  .route('/:id')
  .get(authorize('admin', 'counselor', 'receptionist'), getPayment)
  .put(authorize('admin', 'counselor'),                 validate(updatePaymentRules), updatePayment)
  .delete(authorize('admin'),                           deletePayment);

// PDF receipt download
router.get('/:id/receipt', authorize('admin', 'counselor', 'receptionist'), downloadReceipt);

module.exports = router;
