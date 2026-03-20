const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const Request = require('../request/request.model');
const Response = require('./response.model');
const { getIO } = require('../../sockets');

const responsePopulate = [
  { path: 'requestId', select: 'title description userId createdAt updatedAt' },
  { path: 'userId', select: 'name phone email role createdAt updatedAt' }
];

const createResponse = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.body.requestId);

  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  const response = await Response.create({
    requestId: req.body.requestId,
    userId: req.user._id,
    message: req.body.message
  });

  const populatedResponse = await Response.findById(response._id).populate(responsePopulate);

  // Deliver targeted response updates to the original request owner in real time.
  getIO().to(`user:${request.userId.toString()}`).emit('response:created', populatedResponse);

  res.status(201).json({
    success: true,
    data: populatedResponse
  });
});

const getResponsesByRequestId = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.requestId);

  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  const responses = await Response.find({ requestId: req.params.requestId })
    .populate(responsePopulate)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: responses.length,
    data: responses
  });
});

const updateResponse = asyncHandler(async (req, res) => {
  const response = await Response.findById(req.params.id);

  if (!response) {
    throw new ApiError(404, 'Response not found');
  }

  const isOwner = response.userId.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only update your own responses');
  }

  response.message = req.body.message;
  await response.save();

  const populatedResponse = await Response.findById(response._id).populate(responsePopulate);

  res.status(200).json({
    success: true,
    data: populatedResponse
  });
});

const deleteResponse = asyncHandler(async (req, res) => {
  const response = await Response.findById(req.params.id);

  if (!response) {
    throw new ApiError(404, 'Response not found');
  }

  const isOwner = response.userId.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only delete your own responses');
  }

  await response.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Response deleted successfully'
  });
});

module.exports = {
  createResponse,
  getResponsesByRequestId,
  updateResponse,
  deleteResponse
};
