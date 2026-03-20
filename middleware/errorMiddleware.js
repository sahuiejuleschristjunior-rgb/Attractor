const mongoose = require('mongoose');

// Handle unknown routes in a consistent JSON format.
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Centralized error handler for validation, cast, and server errors.
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal server error';

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'A resource with this unique field already exists';
  }

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};
