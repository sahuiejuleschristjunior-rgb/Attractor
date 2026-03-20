const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const User = require('./user.model');
const { sanitizeUser } = require('../auth/auth.controller');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users.map(sanitizeUser)
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You can only view your own profile');
  }

  res.status(200).json({
    success: true,
    data: sanitizeUser(user)
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isOwner = req.user._id.toString() === user._id.toString();

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only update your own profile');
  }

  if (req.body.role && req.user.role !== 'admin') {
    throw new ApiError(403, 'Only admins can change roles');
  }

  ['name', 'phone', 'role'].forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  res.status(200).json({
    success: true,
    data: sanitizeUser(user)
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Only admins can delete users');
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = {
  listUsers,
  getUserById,
  updateUser,
  deleteUser
};
