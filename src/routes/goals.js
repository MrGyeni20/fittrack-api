const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { protect } = require('../middleware/auth');
const { validateGoal, validateObjectId } = require('../middleware/validation');

router.get('/', protect, goalController.getAllGoals);
router.get('/:id', protect, validateObjectId, goalController.getGoalById);
router.post('/', protect, validateGoal, goalController.createGoal);
router.put('/:id', protect, validateObjectId, validateGoal, goalController.updateGoal);
router.delete('/:id', protect, validateObjectId, goalController.deleteGoal);
router.patch('/:id/progress', protect, validateObjectId, goalController.updateGoalProgress);

module.exports = router;