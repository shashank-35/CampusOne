const express = require('express');
const router  = express.Router();
const { protect }   = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
  changeStudentPassword,
  getStudentCourses,
  getStudentEvents,
  getStudentInquiry,
} = require('../controllers/studentPortalController');
const { getMyTickets } = require('../controllers/ticketController');

// All student portal routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getStudentDashboard);
router.get('/profile',   getStudentProfile);
router.put('/profile',   updateStudentProfile);
router.put('/password',  changeStudentPassword);
router.get('/courses',   getStudentCourses);
router.get('/events',    getStudentEvents);
router.get('/inquiry',   getStudentInquiry);
router.get('/tickets',   getMyTickets);

module.exports = router;
