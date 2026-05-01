const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  deleteProject,
  addMember,
  removeMember,
  getAllUsers,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { validate, projectSchema, memberSchema } = require('../utils/validators');

// All project routes require authentication
router.use(protect);

// GET all users list (for member assignment) — admin only
router.get('/users', requireRole('admin'), getAllUsers);

// GET all projects | POST create project (admin only)
router
  .route('/')
  .get(getProjects)
  .post(requireRole('admin'), validate(projectSchema), createProject);

// DELETE project (admin only)
router.delete('/:id', requireRole('admin'), deleteProject);

// Manage project members (admin only)
router.post('/:id/members', requireRole('admin'), validate(memberSchema), addMember);
router.delete('/:id/members/:userId', requireRole('admin'), removeMember);

module.exports = router;
