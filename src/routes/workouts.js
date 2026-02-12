const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');
const { validateWorkout, validateObjectId } = require('../middleware/validation');

router.get('/', protect, workoutController.getAllWorkouts);
router.get('/stats', protect, workoutController.getWorkoutStats);
router.get('/:id', protect, validateObjectId, workoutController.getWorkoutById);
router.post('/', protect, validateWorkout, workoutController.createWorkout);
router.put('/:id', protect, validateObjectId, validateWorkout, workoutController.updateWorkout);
router.delete('/:id', protect, validateObjectId, workoutController.deleteWorkout);

module.exports = router;