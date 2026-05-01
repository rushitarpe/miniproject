const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, signupSchema, loginSchema } = require('../utils/validators');

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

module.exports = router;
