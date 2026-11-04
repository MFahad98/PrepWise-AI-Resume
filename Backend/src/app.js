
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");

const authRouter = require("./routes/authentication");
const interviewRouter = require("./routes/interview.route");

const app = express();

const allowedOrigins = [
  "http://localhost:5000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(503).json({
      message: "Database connection failed",
    });
  }
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
