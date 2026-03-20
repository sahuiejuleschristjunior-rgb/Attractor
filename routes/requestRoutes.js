const express = require('express');
const {
  createRequest,
  getRequests,
  getRequestById
} = require('../controllers/requestController');

const router = express.Router();

router.route('/').post(createRequest).get(getRequests);
router.get('/:id', getRequestById);

module.exports = router;
