const Exercise = require('../models/Exercise');

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Public
exports.getAllExercises = async (req, res) => {
  try {
    const { category, difficulty, muscleGroup, search } = req.query;
    
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Filter by muscle group
    if (muscleGroup) {
      query.muscleGroups = muscleGroup;
    }

    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }

    const exercises = await Exercise.find(query).populate('createdBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exercises',
      error: error.message
    });
  }
};

// @desc    Get single exercise
// @route   GET /api/exercises/:id
// @access  Public
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id).populate('createdBy', 'firstName lastName');

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exercise',
      error: error.message
    });
  }
};

// @desc    Create new exercise
// @route   POST /api/exercises
// @access  Private
exports.createExercise = async (req, res) => {
  try {
    // Add user as creator if custom exercise
    const exerciseData = {
      ...req.body,
      isCustom: true,
      createdBy: req.user._id
    };

    const exercise = await Exercise.create(exerciseData);

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully',
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating exercise',
      error: error.message
    });
  }
};

// @desc    Update exercise
// @route   PUT /api/exercises/:id
// @access  Private (Creator or Admin)
exports.updateExercise = async (req, res) => {
  try {
    let exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    // Check if user is creator or admin
    if (exercise.createdBy && exercise.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exercise'
      });
    }

    exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Exercise updated successfully',
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating exercise',
      error: error.message
    });
  }
};

// @desc    Delete exercise
// @route   DELETE /api/exercises/:id
// @access  Private (Creator or Admin)
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    // Check if user is creator or admin
    if (exercise.createdBy && exercise.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this exercise'
      });
    }

    await Exercise.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting exercise',
      error: error.message
    });
  }
};

// @desc    Get exercises by category
// @route   GET /api/exercises/category/:category
// @access  Public
exports.getExercisesByCategory = async (req, res) => {
  try {
    const exercises = await Exercise.find({ category: req.params.category });

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exercises',
      error: error.message
    });
  }
};