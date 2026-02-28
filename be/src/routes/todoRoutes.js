const express = require('express');
const router = express.Router();
const { getTodos, getTodo, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createTodoRules, updateTodoRules } = require('../validators/todoValidator');

router.use(protect);

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos for current user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [todo]
 *             properties:
 *               todo: { type: string }
 *               important: { type: boolean }
 *               priority: { type: string, enum: [low, medium, high] }
 *               category: { type: string, enum: [work, personal, study] }
 *     responses:
 *       201:
 *         description: Todo created
 */
router
  .route('/')
  .get(getTodos)
  .post(validate(createTodoRules), createTodo);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Todo data
 *   put:
 *     summary: Update todo
 *     tags: [Todos]
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
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: Todo updated
 *   delete:
 *     summary: Delete todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Todo deleted
 */
router
  .route('/:id')
  .get(getTodo)
  .put(validate(updateTodoRules), updateTodo)
  .delete(deleteTodo);

module.exports = router;
