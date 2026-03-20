const express = require('express');
const {
  createResponse,
  getResponsesByRequestId,
  updateResponse,
  deleteResponse
} = require('./response.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  responseBodyValidation,
  responseUpdateValidation,
  responseIdValidation,
  requestIdParamValidation
} = require('./response.validation');

const router = express.Router();

router.post('/', protect, authorize('provider', 'admin', 'user'), responseBodyValidation, validate, createResponse);
router.get('/request/:requestId', requestIdParamValidation, validate, getResponsesByRequestId);
router.put('/:id', protect, responseIdValidation, responseUpdateValidation, validate, updateResponse);
router.delete('/:id', protect, responseIdValidation, validate, deleteResponse);

module.exports = router;
