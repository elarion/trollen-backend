const express = require('express');
const validateRequest = require('../middlewares/validationRequest');
const { validatorTest } = require('../validators/testValidator');
const router = express.Router();
const { test } = require('../controllers/testController');

router.post('/', validatorTest(), validateRequest, test)

module.exports = router;