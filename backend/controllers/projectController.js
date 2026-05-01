const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res, next) => {
  try {
    const { name, description, deadline, members } = req.body;
    const project = await Project.create({
      name,
      description,
      deadline: deadline || null,
      members: members || [],
      createdBy: req.user._id,
    });
    const populated = await project.populate([
      { path: 'members', select: 'name email role' },
      { path: 'createdBy', select: 'name email' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects (admin: all | member: only their projects)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { members: req.user._id };
    const projects = await Project.find(filter)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project and all its tasks
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Cascade delete all tasks belonging to this project
    await Task.deleteMany({ projectId: project._id });
    await project.deleteOne();
    res.json({ message: 'Project and its tasks deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a member to a project
// @route   POST /api/projects/:id/members
// @access  Private/Admin
const addMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (project.members.map(String).includes(req.body.userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(req.body.userId);
    await project.save();
    const populated = await project.populate('members', 'name email role');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a member from a project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private/Admin
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId
    );
    await project.save();
    const populated = await project.populate('members', 'name email role');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (for member-assignment dropdown)
// @route   GET /api/projects/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('name email role');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  deleteProject,
  addMember,
  removeMember,
  getAllUsers,
};
