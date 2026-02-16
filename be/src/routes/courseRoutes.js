const express = require('express');
const router = express.Router();
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { createCourseRules, updateCourseRules } = require('../validators/courseValidator');
const upload = require('../middleware/upload');

const courseUpload = upload.fields([
  { name: 'handbook', maxCount: 1 },
  { name: 'topicSheet', maxCount: 1 },
]);

router.use(protect);

router
  .route('/')
  .get(getCourses)
  .post(authorize('admin', 'head'), courseUpload, validate(createCourseRules), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(authorize('admin', 'head'), courseUpload, validate(updateCourseRules), updateCourse)
  .delete(authorize('admin'), deleteCourse);

module.exports = router;
