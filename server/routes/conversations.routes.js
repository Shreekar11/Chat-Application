const express = require('express');
const { conversations, getConversation } = require('../controllers/conversations.controller');
const router = express.Router();
require('dotenv').config();

router.post('/conversations', conversations);
router.get('/getConversation', getConversation);

module.exports = router;