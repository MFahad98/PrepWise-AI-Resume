const mongoose = require("mongoose");

/**
 * Serverless-friendly MongoDB connection.
 * Vercel par har request naya function instance start kar sakti hai,
 * is liye connection ko global cache mein rakhte hain taake har request
 * par naya connection na bane.
 */
let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME || "resume",
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .then((m) => {
        console.log("MongoDB connected");
        return m;
      })
      .catch((err) => {
        // Fail hone par promise reset karo taake agli request dobara try kare
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
