// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/user/authController');


// Endpoint de login
router.post('/login', authController.login);


module.exports = router;
