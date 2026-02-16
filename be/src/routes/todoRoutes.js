const express = require('express');
const router = express.Router();
const { getTodos, getTodo, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createTodoRules, updateTodoRules } = require('../validators/todoValidator');

router.use(protect);

router
  .route('/')
  .get(getTodos)
  .post(validate(createTodoRules), createTodo);

router
  .route('/:id')
  .get(getTodo)
  .put(validate(updateTodoRules), updateTodo)
  .delete(deleteTodo);

module.exports = router;
