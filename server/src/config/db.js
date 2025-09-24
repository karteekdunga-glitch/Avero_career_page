import mongoose from 'mongoose';

export async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log('MONGO_URI not set; running without MongoDB (seed JSON only).');
    return;
  }
  try {
    await mongoose.connect(uri, { dbName: 'avero_careers' });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}
