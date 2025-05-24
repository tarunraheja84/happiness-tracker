import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  mood: { type: Number, required: true, min: 1, max: 5 },
  activities: [{ type: String }],
  notes: { type: String },
  sleepHours: { type: Number, min: 0, max: 24 },
  exerciseMinutes: { type: Number, min: 0 },
  socialInteraction: { type: Boolean, default: false },
  meditationMinutes: { type: Number, min: 0 },
  gratitude: [{ type: String }],
  challenges: [{ type: String }],
  achievements: [{ type: String }],
  weather: { type: String },
  location: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Entry = mongoose.models.Entry || mongoose.model('Entry', entrySchema); 