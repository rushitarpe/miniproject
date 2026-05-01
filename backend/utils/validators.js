const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'member').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const projectSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional().allow(''),
  deadline: Joi.date().optional().allow(null),
  members: Joi.array().items(Joi.string()).optional(),
});

const memberSchema = Joi.object({
  userId: Joi.string().required(),
});

const taskSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(1000).optional().allow(''),
  assignedTo: Joi.string().optional().allow('', null),
  projectId: Joi.string().required(),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed').optional(),
  dueDate: Joi.date().optional().allow(null),
});

const taskUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(1000).optional().allow(''),
  assignedTo: Joi.string().optional().allow('', null),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed').optional(),
  dueDate: Joi.date().optional().allow(null),
});

// Middleware factory: validates req.body against a Joi schema
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({ message });
  }
  next();
};

module.exports = {
  validate,
  signupSchema,
  loginSchema,
  projectSchema,
  memberSchema,
  taskSchema,
  taskUpdateSchema,
};
