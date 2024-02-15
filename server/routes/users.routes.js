const express = require('express');
const { register, login, getUsers } = require('../controllers/user.controller');
const router = express.Router();
require('dotenv').config();

router.post('/register', register);
router.post('/login', login);
router.get('/getUsers', getUsers);

module.exports = router