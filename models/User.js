const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      minlength: 7,
      maxlength: 20
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      enum: ['user', 'provider', 'admin']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('User', userSchema);
