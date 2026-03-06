const express = require('express');
const router = express.Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { createEventRules, updateEventRules } = require('../validators/eventValidator');

router.use(protect);

router
  .route('/')
  .get(getEvents)
  .post(authorize('admin'), validate(createEventRules), createEvent);

router
  .route('/:id')
  .get(getEvent)
  .put(authorize('admin'), validate(updateEventRules), updateEvent)
  .delete(authorize('admin'), deleteEvent);

module.exports = router;
