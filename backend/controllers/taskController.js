const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, projectId, status, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || null,
      projectId,
      status: status || 'Pending',
      dueDate: dueDate || null,
    });

    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'projectId', select: 'name' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks (admin: all | member: only assigned to them)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const query = {};

    // Members only see tasks assigned to them
    if (req.user.role === 'member') {
      query.assignedTo = req.user._id;
    }

    // Optional filters via query params
    if (req.query.projectId) query.projectId = req.query.projectId;
    if (req.query.status) query.status = req.query.status;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (member: status only | admin: full update)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'member') {
      // Members can only update status of tasks assigned to them
      if (task.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      if (req.body.status) task.status = req.body.status;
    } else {
      // Admin can update all fields
      const { title, description, assignedTo, status, dueDate } = req.body;
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
      if (status !== undefined) task.status = status;
      if (dueDate !== undefined) task.dueDate = dueDate || null;
    }

    const updated = await task.save();
    const populated = await updated.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'projectId', select: 'name' },
    ]);
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
