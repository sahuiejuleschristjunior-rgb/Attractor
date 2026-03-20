const { body, param } = require('express-validator');

const requestBodyValidation = [
  body('title').trim().isLength({ min: 3, max: 150 }).withMessage('Title must be between 3 and 150 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters')
];

const requestIdValidation = [param('id').isMongoId().withMessage('Request id must be a valid MongoDB ObjectId')];

module.exports = {
  requestBodyValidation,
  requestIdValidation
};
