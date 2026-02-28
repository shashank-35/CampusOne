const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalStudents: { type: number }
 *                         totalCourses: { type: number }
 *                         upcomingEvents: { type: number }
 *                         newInquiries: { type: number }
 *                         totalProducts: { type: number }
 *                         totalUsers: { type: number }
 */
router.get('/stats', getStats);

module.exports = router;
