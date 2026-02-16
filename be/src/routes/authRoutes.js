const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { registerRules, loginRules } = require('../validators/authValidator');

router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
