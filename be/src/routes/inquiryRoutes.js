const express = require('express');
const router = express.Router();
const { getInquiries, getInquiry, createInquiry, updateInquiry, deleteInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { createInquiryRules, updateInquiryRules } = require('../validators/inquiryValidator');

router.use(protect);

/**
 * @swagger
 * /inquiries:
 *   get:
 *     summary: Get all inquiries
 *     tags: [Inquiries]
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
 *         description: List of inquiries
 *   post:
 *     summary: Create a new inquiry
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inquiry'
 *     responses:
 *       201:
 *         description: Inquiry created
 */
router
  .route('/')
  .get(authorize('admin', 'head', 'staff'), getInquiries)
  .post(authorize('admin', 'head', 'staff'), validate(createInquiryRules), createInquiry);

/**
 * @swagger
 * /inquiries/{id}:
 *   get:
 *     summary: Get inquiry by ID
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Inquiry data
 *   put:
 *     summary: Update inquiry
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inquiry'
 *     responses:
 *       200:
 *         description: Inquiry updated
 *   delete:
 *     summary: Delete inquiry
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Inquiry deleted
 */
router
  .route('/:id')
  .get(authorize('admin', 'head', 'staff'), getInquiry)
  .put(authorize('admin', 'head', 'staff'), validate(updateInquiryRules), updateInquiry)
  .delete(authorize('admin', 'head'), deleteInquiry);

module.exports = router;
