const mongoose = require('mongoose');

/**
 * Connects to MongoDB using MONGO_URI from the environment. Logs a clear
 * warning (rather than crashing the whole process) if the DB is unreachable,
 * so the API can still boot for review/inspection.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('The server will keep running, but any DB-backed routes will fail until MONGO_URI is reachable.');
  }
};

module.exports = connectDB;
