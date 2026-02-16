const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validate } = require('../middleware/validate');
const { createUserRules, updateUserRules } = require('../validators/userValidator');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'head'), getUsers)
  .post(authorize('admin'), validate(createUserRules), createUser);

router
  .route('/:id')
  .get(authorize('admin', 'head'), getUser)
  .put(authorize('admin'), validate(updateUserRules), updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router;
