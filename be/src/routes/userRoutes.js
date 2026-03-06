const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser, getCounselors } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { createUserRules, updateUserRules } = require('../validators/userValidator');
const { logActivity } = require('../middleware/activityLogger');

router.use(protect);

router.get('/counselors', authorize('admin', 'counselor', 'receptionist'), getCounselors);

router
  .route('/')
  .get(authorize('admin'), getUsers)
  .post(
    authorize('admin'),
    validate(createUserRules),
    logActivity('CREATE', 'User', 'Created a new user'),
    createUser
  );

router
  .route('/:id')
  .get(authorize('admin'), getUser)
  .put(
    authorize('admin'),
    validate(updateUserRules),
    logActivity('UPDATE', 'User', 'Updated a user'),
    updateUser
  )
  .delete(
    authorize('admin'),
    logActivity('DELETE', 'User', 'Deleted a user'),
    deleteUser
  );

module.exports = router;
