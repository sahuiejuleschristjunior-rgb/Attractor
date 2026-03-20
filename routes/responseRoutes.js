const express = require('express');
const {
  createResponse,
  getResponsesByRequestId
} = require('../controllers/responseController');

const router = express.Router();

router.post('/', createResponse);
router.get('/:requestId', getResponsesByRequestId);

module.exports = router;
