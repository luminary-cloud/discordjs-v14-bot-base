const mongoose = require('mongoose');

const { MONGO_URI, NODE_ENV } = process.env;

async function connectMongo() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing in environment variables.');
  }

  mongoose.set('strictQuery', true);

  // Improve stability in dev by enabling detailed logs
  const isDev = (NODE_ENV || '').toLowerCase() === 'development';
  if (isDev) {
    mongoose.set('debug', false);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: !isDev ? false : true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    const conn = mongoose.connection;
    conn.on('connected', () => {
      console.log('📦 MongoDB connected');
    });
    conn.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    conn.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    return conn;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}

async function disconnectMongo() {
  try {
    await mongoose.disconnect();
    console.log('📦 MongoDB disconnected cleanly');
  } catch (err) {
    console.error('Error during MongoDB disconnect:', err);
  }
}

module.exports = { connectMongo, disconnectMongo };
