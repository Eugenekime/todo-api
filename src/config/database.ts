import { MongoClient } from 'mongodb';
import 'dotenv/config';

const URI = process.env.MONGODB_URI;
const isProduction = process.env.NODE_ENV === 'production';
const maxAttempts = isProduction ? 5 : 1;

if (!URI) {
  throw new Error('MONGODB_URI is not defined');
}

const client = new MongoClient(URI, { maxPoolSize: 10 });

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function connectDB(): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.connect();
      const db = client.db('todo');
      console.log(`MongoDB connection attempt ${attempt}/${maxAttempts}`);
      await db.command({ ping: 1 });
      console.log('MongoDB connected successfully');

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
    const db = client.db('todo');
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export function getDB() {
  return client.db('todo');
}
