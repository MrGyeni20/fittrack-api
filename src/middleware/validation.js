const { body, param, validationResult } = require('express-validator');

// Handle validation errors
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

// User validation rules
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
  this.handleValidationErrors
];

exports.validateUserLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  this.handleValidationErrors
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
  this.handleValidationErrors
];

// Exercise validation rules
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
  this.handleValidationErrors
];

// ID validation
exports.validateObjectId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  this.handleValidationErrors
];