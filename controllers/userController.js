const User = require('../models/User');

// Create a new platform user.
const createUser = async (req, res, next) => {
  try {
    const { name, phone, email, role } = req.body;

    if (!name || !phone || !email || !role) {
      res.status(400);
      throw new Error('name, phone, email, and role are required');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409);
      throw new Error('User with this email already exists');
    }

    const user = await User.create({
      name,
      phone,
      email,
      role
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser
};
