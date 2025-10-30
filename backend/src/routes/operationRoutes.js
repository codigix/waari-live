const express = require('express');
const router = express.Router();
const { operationLogin } = require('../controllers/operations/AuthController');

router.post('/login', operationLogin);

module.exports = router;