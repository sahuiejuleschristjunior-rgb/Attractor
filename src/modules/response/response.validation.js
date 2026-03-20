const { body, param } = require('express-validator');

const responseBodyValidation = [
  body('requestId').isMongoId().withMessage('requestId must be a valid MongoDB ObjectId'),
  body('message')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Message must be between 5 and 2000 characters')
];

const responseUpdateValidation = [
  body('message')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Message must be between 5 and 2000 characters')
];

const responseIdValidation = [param('id').isMongoId().withMessage('Response id must be a valid MongoDB ObjectId')];
const requestIdParamValidation = [param('requestId').isMongoId().withMessage('Request id must be a valid MongoDB ObjectId')];

module.exports = {
  responseBodyValidation,
  responseUpdateValidation,
  responseIdValidation,
  requestIdParamValidation
};
