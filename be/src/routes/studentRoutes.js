const express = require('express');
const router = express.Router();
const { getStudents, getStudent, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { createStudentRules, updateStudentRules } = require('../validators/studentValidator');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'head', 'staff'), getStudents)
  .post(authorize('admin', 'head', 'staff'), validate(createStudentRules), createStudent);

router
  .route('/:id')
  .get(authorize('admin', 'head', 'staff'), getStudent)
  .put(authorize('admin', 'head', 'staff'), validate(updateStudentRules), updateStudent)
  .delete(authorize('admin', 'head'), deleteStudent);

module.exports = router;
