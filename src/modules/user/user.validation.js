const { body, param } = require('express-validator');

const objectIdParam = (field) => param(field).isMongoId().withMessage(`${field} must be a valid MongoDB ObjectId`);

const updateUserValidation = [
  objectIdParam('id'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('phone').optional().trim().isLength({ min: 7, max: 20 }).withMessage('Phone must be between 7 and 20 characters'),
  body('role').optional().isIn(['user', 'provider', 'admin']).withMessage('Role must be user, provider, or admin')
];

module.exports = {
  objectIdParam,
  updateUserValidation
};
