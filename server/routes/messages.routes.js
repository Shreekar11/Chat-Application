const express = require('express');
const { message, getMessage } = require('../controllers/messages.controller');
const router = express.Router();
require('dotenv').config();

router.post('/message', message);
router.get('/getMessage', getMessage);

module.exports = router;