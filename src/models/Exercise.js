const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true,
    maxlength: [100, 'Exercise name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['strength', 'cardio', 'flexibility', 'sports', 'other']
  },
  muscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 
           'abs', 'obliques', 'quads', 'hamstrings', 'calves', 'glutes', 
           'full-body', 'core']
  }],
  equipment: [{
    type: String,
    enum: ['barbell', 'dumbbell', 'kettlebell', 'machine', 'cable', 
           'bodyweight', 'resistance-band', 'bench', 'pull-up-bar', 
           'treadmill', 'bike', 'rower', 'mat', 'none']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  instructions: [{
    type: String
  }],
  videoUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL']
  },
  imageUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL']
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Index for search functionality
exerciseSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Exercise', exerciseSchema);