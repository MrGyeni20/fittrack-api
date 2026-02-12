const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validateUserUpdate, validateObjectId } = require('../middleware/validation');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, validateUserUpdate, userController.updateProfile);
router.delete('/profile', protect, userController.deleteAccount);

router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.get('/:id', protect, authorize('admin'), validateObjectId, userController.getUserById);

module.exports = router;