const express = require('express');
const { listUsers, getUserById, updateUser, deleteUser } = require('./user.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { objectIdParam, updateUserValidation } = require('./user.validation');

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin'), listUsers);
router.get('/:id', objectIdParam('id'), validate, getUserById);
router.put('/:id', updateUserValidation, validate, updateUser);
router.delete('/:id', objectIdParam('id'), validate, authorize('admin'), deleteUser);

module.exports = router;
