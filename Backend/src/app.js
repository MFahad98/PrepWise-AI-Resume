const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const authRouter = require("./routes/authentication");
const interviewRouter = require("./routes/interview.route");

const app = express();

// Vercel proxy ke peeche chalta hai (secure cookies + correct protocol ke liye)
app.set("trust proxy", 1);

// Allowed frontend origins: CLIENT_URL mein comma-separated URLs de sakte hain
// e.g. CLIENT_URL=https://my-frontend.vercel.app,https://www.mydomain.com
const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:3001",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean),
];

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin / server-to-server requests (no Origin header) allow
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Resume AI API is running" });
});
app.get("/api", (req, res) => {
  res.status(200).json({ status: "ok", message: "Resume AI API is running" });
});

// Har API request se pehle DB connection ensure karo (serverless cold start)
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(503).json({ message: "Database connection failed" });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (Express 5 async errors bhi yahan aate hain)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (err.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Resume file is too large (max 3MB)"
        : err.message;
    return res.status(400).json({ message });
  }

  if (err.name === "CastError") {
    return res.status(404).json({ message: "Resource not found" });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  // Sirf valid HTTP status codes aage bhejo (Gemini/3rd-party errors ke ajeeb codes nahi)
  const rawStatus = Number(err.status || err.statusCode);
  const status = rawStatus >= 400 && rawStatus < 600 ? rawStatus : 500;
  res.status(status).json({
    message: status === 500 ? "Internal server error" : err.message,
  });
});

module.exports = app;
