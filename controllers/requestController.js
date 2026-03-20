const mongoose = require('mongoose');
const Request = require('../models/Request');
const User = require('../models/User');

// Create a new request that will be visible to all users on the platform.
const createRequest = async (req, res, next) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !description || !userId) {
      res.status(400);
      throw new Error('title, description, and userId are required');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error('Invalid userId');
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const request = await Request.create({
      title,
      description,
      userId
    });

    const populatedRequest = await request.populate('userId', 'name phone email role');

    res.status(201).json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

// Return all requests ordered by newest first.
const getRequests = async (req, res, next) => {
  try {
    const requests = await Request.find()
      .populate('userId', 'name phone email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// Return a single request by its identifier.
const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid request ID');
    }

    const request = await Request.findById(id).populate('userId', 'name phone email role');

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById
};
