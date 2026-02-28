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

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of courses
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               duration: { type: string }
 *               fees: { type: string }
 *               handbook: { type: string, format: binary }
 *               topicSheet: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Course created
 */
router
  .route('/')
  .get(getCourses)
  .post(authorize('admin', 'head'), courseUpload, validate(createCourseRules), createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Course data
 *   put:
 *     summary: Update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               duration: { type: string }
 *               fees: { type: string }
 *               handbook: { type: string, format: binary }
 *               topicSheet: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Course updated
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Course deleted
 */
router
  .route('/:id')
  .get(getCourse)
  .put(authorize('admin', 'head'), courseUpload, validate(updateCourseRules), updateCourse)
  .delete(authorize('admin'), deleteCourse);

module.exports = router;
