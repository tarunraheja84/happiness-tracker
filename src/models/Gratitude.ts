import mongoose from 'mongoose';

const gratitudeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: Date, required: true },
  gratitudes: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a compound index for email and date
gratitudeSchema.index({ email: 1, date: 1 }, { unique: true });

export const Gratitude = mongoose.models.Gratitude || mongoose.model('Gratitude', gratitudeSchema); 