const express = require('express');
const router = express.Router();
const { getStudents, getStudent, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { createStudentRules, updateStudentRules } = require('../validators/studentValidator');
const { logActivity } = require('../middleware/activityLogger');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'counselor', 'receptionist'), getStudents)
  .post(authorize('admin', 'receptionist'), validate(createStudentRules), logActivity('CREATE', 'Student', 'Created a student record'), createStudent);

router
  .route('/:id')
  .get(authorize('admin', 'counselor', 'receptionist'), getStudent)
  .put(authorize('admin', 'receptionist'), validate(updateStudentRules), logActivity('UPDATE', 'Student', 'Updated a student record'), updateStudent)
  .delete(authorize('admin'), logActivity('DELETE', 'Student', 'Deleted a student record'), deleteStudent);

module.exports = router;
