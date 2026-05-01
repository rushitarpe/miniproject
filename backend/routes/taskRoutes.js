const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { validate, taskSchema, taskUpdateSchema } = require('../utils/validators');

// All task routes require authentication
router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(requireRole('admin'), validate(taskSchema), createTask);

router
  .route('/:id')
  .put(validate(taskUpdateSchema), updateTask)
  .delete(requireRole('admin'), deleteTask);

module.exports = router;
