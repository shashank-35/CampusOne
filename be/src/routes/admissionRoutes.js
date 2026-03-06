const express = require('express');
const router  = express.Router();
const { protect }   = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate }  = require('../middleware/validate');
const { uploadAdmission } = require('../middleware/upload');
const { createAdmissionRules, updateAdmissionRules } = require('../validators/admissionValidator');
const {
  getAdmissions,
  getAdmission,
  createAdmission,
  updateAdmission,
  deleteAdmission,
} = require('../controllers/admissionController');

// Multer fields for document upload
const admissionUpload = uploadAdmission.fields([
  { name: 'photo',     maxCount: 1 },
  { name: 'idProof',   maxCount: 1 },
  { name: 'marksheet', maxCount: 1 },
]);

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'counselor', 'receptionist'), getAdmissions)
  .post(authorize('admin', 'counselor', 'receptionist'), admissionUpload, validate(createAdmissionRules), createAdmission);

router
  .route('/:id')
  .get(authorize('admin', 'counselor', 'receptionist'), getAdmission)
  .put(authorize('admin', 'counselor'), admissionUpload, validate(updateAdmissionRules), updateAdmission)
  .delete(authorize('admin'), deleteAdmission);

module.exports = router;
