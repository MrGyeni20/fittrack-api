const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  description: { type: String, required: true },
  targetValue: { type: Number, required: true },
  achieved: { type: Boolean, default: false },
  achievedDate: Date
}, { _id: false });

const targetMetricSchema = new mongoose.Schema({
  metricType: { type: String, required: true },
  currentValue: { type: Number, required: true },
  targetValue: { type: Number, required: true },
  unit: { type: String, required: true }
}, { _id: false });

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    required: true,
    enum: ['weight-loss', 'muscle-gain', 'strength', 'endurance', 'consistency', 'other']
  },
  targetMetric: targetMetricSchema,
  startDate: {
    type: Date,
    default: Date.now
  },
  targetDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  milestones: [milestoneSchema],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

goalSchema.methods.calculateProgress = function() {
  const { currentValue, targetValue } = this.targetMetric;
  this.progress = Math.min(100, Math.round((currentValue / targetValue) * 100));
  return this.progress;
};

module.exports = mongoose.model('Goal', goalSchema);