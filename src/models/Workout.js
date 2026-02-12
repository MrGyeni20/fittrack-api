const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  setNumber: { type: Number, required: true },
  reps: { type: Number, min: 0 },
  weightKg: { type: Number, min: 0 },
  restSeconds: { type: Number, min: 0 },
  completed: { type: Boolean, default: false }
}, { _id: false });

const cardioDataSchema = new mongoose.Schema({
  durationMinutes: { type: Number, min: 0 },
  distanceKm: { type: Number, min: 0 },
  caloriesBurned: { type: Number, min: 0 },
  averageHeartRate: { type: Number, min: 0 }
}, { _id: false });

const exerciseEntrySchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  exerciseName: { type: String, required: true },
  sets: [setSchema],
  cardioData: cardioDataSchema,
  notes: String
}, { _id: false });

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'mixed', 'flexibility'],
    required: true
  },
  exercises: [exerciseEntrySchema],
  totalDurationMinutes: {
    type: Number,
    min: 0
  },
  caloriesBurned: {
    type: Number,
    min: 0
  },
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  completed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);