import mongoose from 'mongoose';

const wellnessSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  meditation: {
    type: Number,
    default: 0,
  },
  sleep: {
    type: Number,
    default: 0,
  },
  exercise: {
    type: Number,
    default: 0,
  },
  steps: {
    type: Number,
    default: 0,
  },
  water: {
    type: Boolean,
    default: false,
  },
  healthy: {
    type: Boolean,
    default: false,
  },
  reading: {
    type: Boolean,
    default: false,
  },
  journaling: {
    type: Boolean,
    default: false,
  },
  stretching: {
    type: Boolean,
    default: false,
  },
  socialConnection: {
    type: Boolean,
    default: false,
  },
  screenTime: {
    type: Number,
    default: 0,
  },
  wakeTime: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a compound index for email and date
wellnessSchema.index({ email: 1, date: 1 }, { unique: true });

export const Wellness = mongoose.models.Wellness || mongoose.model('Wellness', wellnessSchema); 