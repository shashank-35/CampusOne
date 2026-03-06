const express = require('express');
const router = express.Router();
const {
  getInquiries, getInquiry, createInquiry, publicCreateInquiry,
  updateInquiry, deleteInquiry, assignInquiry, addNote, convertToStudent,
} = require('../controllers/inquiryController');
const { convertInquiryToAdmission } = require('../controllers/admissionController');
const { uploadAdmission } = require('../middleware/upload');

const admissionUpload = uploadAdmission.fields([
  { name: 'photo',     maxCount: 1 },
  { name: 'idProof',   maxCount: 1 },
  { name: 'marksheet', maxCount: 1 },
]);
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { createInquiryRules, updateInquiryRules } = require('../validators/inquiryValidator');
const { logActivity } = require('../middleware/activityLogger');

// Public route — no auth required (QR code / website form)
router.post('/public', validate(createInquiryRules), publicCreateInquiry);

// All routes below require authentication
router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'counselor', 'receptionist'), getInquiries)
  .post(
    authorize('admin', 'counselor', 'receptionist'),
    validate(createInquiryRules),
    logActivity('CREATE', 'Inquiry', 'Created a new inquiry'),
    createInquiry
  );

router
  .route('/:id')
  .get(authorize('admin', 'counselor', 'receptionist'), getInquiry)
  .put(
    authorize('admin', 'counselor', 'receptionist'),
    validate(updateInquiryRules),
    logActivity('UPDATE', 'Inquiry', 'Updated an inquiry'),
    updateInquiry
  )
  .delete(
    authorize('admin', 'counselor'),
    logActivity('DELETE', 'Inquiry', 'Deleted an inquiry'),
    deleteInquiry
  );

// Assign inquiry to counselor (Admin / Receptionist)
router.put(
  '/:id/assign',
  authorize('admin', 'receptionist'),
  logActivity('ASSIGN', 'Inquiry', 'Assigned inquiry to counselor'),
  assignInquiry
);

// Add note to inquiry
router.post(
  '/:id/notes',
  authorize('admin', 'counselor', 'receptionist'),
  logActivity('NOTE', 'Inquiry', 'Added note to inquiry'),
  addNote
);

// Convert inquiry to student (Counselor / Admin)
router.post(
  '/:id/convert',
  authorize('admin', 'counselor'),
  logActivity('CONVERT', 'Inquiry', 'Converted inquiry to student'),
  convertToStudent
);

// Convert inquiry to admission (Counselor / Admin)
router.post(
  '/:id/convert-admission',
  authorize('admin', 'counselor'),
  admissionUpload,
  logActivity('CONVERT', 'Inquiry', 'Converted inquiry to admission'),
  convertInquiryToAdmission
);

module.exports = router;
