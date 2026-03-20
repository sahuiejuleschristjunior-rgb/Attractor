const mongoose = require('mongoose');
const Response = require('../models/Response');
const Request = require('../models/Request');
const User = require('../models/User');

// Create a response from a user who can fulfill a request.
const createResponse = async (req, res, next) => {
  try {
    const { requestId, userId, message } = req.body;

    if (!requestId || !userId || !message) {
      res.status(400);
      throw new Error('requestId, userId, and message are required');
    }

    if (!mongoose.Types.ObjectId.isValid(requestId) || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error('Invalid requestId or userId');
    }

    const [request, user] = await Promise.all([
      Request.findById(requestId),
      User.findById(userId)
    ]);

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const response = await Response.create({
      requestId,
      userId,
      message
    });

    const populatedResponse = await response.populate([
      { path: 'requestId', select: 'title description createdAt' },
      { path: 'userId', select: 'name phone email role' }
    ]);

    res.status(201).json({
      success: true,
      data: populatedResponse
    });
  } catch (error) {
    next(error);
  }
};

// Return every response attached to a specific request.
const getResponsesByRequestId = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      res.status(400);
      throw new Error('Invalid request ID');
    }

    const request = await Request.findById(requestId);

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    const responses = await Response.find({ requestId })
      .populate('userId', 'name phone email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResponse,
  getResponsesByRequestId
};
