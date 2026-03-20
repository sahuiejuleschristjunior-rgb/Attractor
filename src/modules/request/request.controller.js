const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const Request = require('./request.model');
const { getIO } = require('../../sockets');

const requestPopulate = [
  { path: 'userId', select: 'name phone email role createdAt updatedAt' }
];

const createRequest = asyncHandler(async (req, res) => {
  const request = await Request.create({
    title: req.body.title,
    description: req.body.description,
    userId: req.user._id
  });

  const populatedRequest = await Request.findById(request._id).populate(requestPopulate);

  // Broadcast new marketplace activity to every connected client.
  getIO().emit('request:created', populatedRequest);

  res.status(201).json({
    success: true,
    data: populatedRequest
  });
});

const getRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find().populate(requestPopulate).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});

const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id).populate(requestPopulate);

  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  res.status(200).json({
    success: true,
    data: request
  });
});

const updateRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  const isOwner = request.userId.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only update your own requests');
  }

  request.title = req.body.title ?? request.title;
  request.description = req.body.description ?? request.description;
  await request.save();

  const populatedRequest = await Request.findById(request._id).populate(requestPopulate);

  res.status(200).json({
    success: true,
    data: populatedRequest
  });
});

const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  const isOwner = request.userId.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only delete your own requests');
  }

  await request.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Request deleted successfully'
  });
});

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest
};
