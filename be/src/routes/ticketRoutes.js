const express    = require('express');
const router     = express.Router();
const { protect }   = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { createTicket, getTickets, updateTicket } = require('../controllers/ticketController');

router.use(protect);

// Student submits a ticket
router.post('/', authorize('student'), createTicket);

// Admin / Counselor views all tickets
router.get('/', authorize('admin', 'counselor'), getTickets);

// Admin / Counselor updates a ticket (status, assign, reply)
router.put('/:id', authorize('admin', 'counselor'), updateTicket);

module.exports = router;
