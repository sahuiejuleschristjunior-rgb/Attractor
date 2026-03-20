const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { generateToken } = require('../../utils/jwt');
const User = require('../user/user.model');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  phone: user.phone,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const register = asyncHandler(async (req, res) => {
  const { name, phone, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({
    name,
    phone,
    email,
    password,
    role: role || 'user'
  });

  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json({
    success: true,
    data: {
      user: sanitizeUser(user),
      token
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({ id: user._id, role: user.role });

  res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(user),
      token
    }
  });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: sanitizeUser(req.user)
  });
});

module.exports = {
  register,
  login,
  me,
  sanitizeUser
};
