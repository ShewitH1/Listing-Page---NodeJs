const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/new', userController.new);          // Sign-up form
router.post('/signup', userController.signup);    // Handle sign-up
router.get('/login', userController.loginForm);   // Login form
router.post('/login', userController.login);      // Handle login
router.get('/profile', userController.profile);   // User profile
router.get('/logout', userController.logout);     // Handle logout

module.exports = router;