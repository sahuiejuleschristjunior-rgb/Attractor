const express = require('express');
const { register, login, me } = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validation');
const validate = require('../../middlewares/validate.middleware');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, me);

module.exports = router;
