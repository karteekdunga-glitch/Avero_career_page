import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: String,
  type: String,
  salaryRange: String,
  summary: String,
  description: String,
  requirements: [String],
  postedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
