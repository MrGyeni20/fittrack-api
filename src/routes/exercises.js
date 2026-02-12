const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { protect } = require('../middleware/auth');
const { validateExercise, validateObjectId } = require('../middleware/validation');

router.get('/', exerciseController.getAllExercises);
router.get('/:id', validateObjectId, exerciseController.getExerciseById);
router.post('/', protect, validateExercise, exerciseController.createExercise);
router.put('/:id', protect, validateObjectId, validateExercise, exerciseController.updateExercise);
router.delete('/:id', protect, validateObjectId, exerciseController.deleteExercise);
router.get('/category/:category', exerciseController.getExercisesByCategory);

module.exports = router;