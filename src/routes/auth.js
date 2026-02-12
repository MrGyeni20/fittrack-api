const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

router.post('/register', validateUserRegistration, userController.register);
router.post('/login', validateUserLogin, userController.login);

module.exports = router;