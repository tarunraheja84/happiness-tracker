import mongoose from 'mongoose';

const moodDetractorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  severity: { type: Number, required: true, min: 1, max: 5 },
  notes: { type: String, default: '' }
}, { _id: false });

const happinessSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: Date, required: true },
  score: { type: Number, required: true, min: 1, max: 10 },
  reflection: { type: String, required: true },
  moodDetractors: { type: [moodDetractorSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a compound index for email and date
happinessSchema.index({ email: 1, date: 1 }, { unique: true });

export const Happiness = mongoose.models.Happiness || mongoose.model('Happiness', happinessSchema); 