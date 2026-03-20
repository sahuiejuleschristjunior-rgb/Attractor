const express = require('express');
const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest
} = require('./request.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { requestBodyValidation, requestIdValidation } = require('./request.validation');

const router = express.Router();

router
  .route('/')
  .get(getRequests)
  .post(protect, authorize('user', 'provider', 'admin'), requestBodyValidation, validate, createRequest);

router
  .route('/:id')
  .get(requestIdValidation, validate, getRequestById)
  .put(protect, requestIdValidation, requestBodyValidation, validate, updateRequest)
  .delete(protect, requestIdValidation, validate, deleteRequest);

module.exports = router;
