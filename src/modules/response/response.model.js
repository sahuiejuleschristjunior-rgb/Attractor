const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: [true, 'Request ID is required'],
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: 5,
      maxlength: 2000
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Response', responseSchema);
