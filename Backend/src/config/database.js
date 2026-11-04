
const mongoose = require("mongoose");

let connectionPromise = null;

async function connectDB() {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Reuse existing connection attempt
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        dbName: "resume",
        serverSelectionTimeoutMS: 10000,
      })
      .then(() => {
        console.log("MongoDB connected successfully");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
