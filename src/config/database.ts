import mongoose from 'mongoose';
import 'dotenv/config';

const URI = process.env.MONGODB_URI;
const isProduction = process.env.NODE_ENV === 'production';
const maxAttempts = isProduction ? 5 : 1;

if (!URI) {
  throw new Error('MONGODB_URI is not defined');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function connectDB(): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (!URI) {
        throw new Error('MONGODB_URI is not defined');
      }
      await mongoose.connect(URI, {
        dbName: 'todo',
      });
      await mongoose.connection.db?.command({ ping: 1 });
      console.log(`MongoDB connection attempt ${attempt}/${maxAttempts}`);

      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error('MongoDB connection failed:', error);
        throw error;
      }
      await sleep(1000);
    }
  }
}

export async function checkDB(): Promise<boolean> {
  try {
    if (mongoose.connection.readyState !== 1) {
      return false;
    }
    await mongoose.connection.db?.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}
