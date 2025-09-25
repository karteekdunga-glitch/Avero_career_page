import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle: String,
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  phone: String,
  experience: String,
  resume: {
    originalName: String,
    path: String,
    mimeType: String,
    size: Number,
  },
  coverLetter: String,
  status: { type: String, enum: ['Applied', 'Interview', 'Hired', 'Rejected'], default: 'Applied' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
