const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  if (statusCode === 200) {
    statusCode = 500;
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((error) => error.message);
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'A resource with this unique field already exists';
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};
