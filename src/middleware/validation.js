const { body, param, validationResult } = require('express-validator');

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

exports.validateUserRegistration = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateUserLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('profile.heightCm')
    .optional()
    .isFloat({ min: 0 }).withMessage('Height must be a positive number'),
  body('profile.currentWeightKg')
    .optional()
    .isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateExercise = [
  body('name')
    .trim()
    .notEmpty().withMessage('Exercise name is required')
    .isLength({ max: 100 }).withMessage('Exercise name cannot exceed 100 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['strength', 'cardio', 'flexibility', 'sports', 'other'])
    .withMessage('Invalid category'),
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
  body('muscleGroups')
    .optional()
    .isArray().withMessage('Muscle groups must be an array'),
  body('equipment')
    .optional()
    .isArray().withMessage('Equipment must be an array'),
  body('videoUrl')
    .optional()
    .isURL().withMessage('Please provide a valid video URL'),
  body('imageUrl')
    .optional()
    .isURL().withMessage('Please provide a valid image URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateObjectId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateWorkout = [
  body('name')
    .trim()
    .notEmpty().withMessage('Workout name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('type')
    .notEmpty().withMessage('Workout type is required')
    .isIn(['strength', 'cardio', 'mixed', 'flexibility']).withMessage('Invalid workout type'),
  body('date')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('exercises')
    .isArray({ min: 1 }).withMessage('At least one exercise is required'),
  body('totalDurationMinutes')
    .optional()
    .isFloat({ min: 0 }).withMessage('Duration must be positive'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateGoal = [
  body('title')
    .trim()
    .notEmpty().withMessage('Goal title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('type')
    .notEmpty().withMessage('Goal type is required')
    .isIn(['weight-loss', 'muscle-gain', 'strength', 'endurance', 'consistency', 'other'])
    .withMessage('Invalid goal type'),
  body('targetDate')
    .notEmpty().withMessage('Target date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('targetMetric.metricType')
    .notEmpty().withMessage('Metric type is required'),
  body('targetMetric.currentValue')
    .notEmpty().withMessage('Current value is required')
    .isFloat({ min: 0 }).withMessage('Current value must be positive'),
  body('targetMetric.targetValue')
    .notEmpty().withMessage('Target value is required')
    .isFloat({ min: 0 }).withMessage('Target value must be positive'),
  body('targetMetric.unit')
    .notEmpty().withMessage('Unit is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];