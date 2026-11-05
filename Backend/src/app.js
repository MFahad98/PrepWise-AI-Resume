const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");

const authRouter = require("./routes/authentication");
const interviewRouter = require("./routes/interview.route");

const app = express();

// Vercel proxy ke peeche hai, secure cookies ke liye zaroori
app.set("trust proxy", 1);

// Trailing slash hata do: "https://abc.vercel.app/" -> "https://abc.vercel.app"
const normalize = (url) => (url || "").trim().replace(/\/+$/, "");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://prep-wise-ai-resume-kw22.vercel.app",
  "https://prep-wise-ai-resume.vercel.app",
  // Vercel env: FRONTEND_URL (comma se multiple bhi de sakte ho)
  ...(process.env.FRONTEND_URL || "").split(","),
]
  .map(normalize)
  .filter(Boolean);

// Vercel preview deployments, e.g. https://prep-wise-ai-resume-kw22-git-main-xyz.vercel.app
const vercelPreviewRegex = /^https:\/\/prep-wise-ai-resume[a-z0-9-]*\.vercel\.app$/;

const corsOptions = {
  origin(origin, callback) {
    // Postman / server-to-server requests ka origin nahi hota
    if (!origin) return callback(null, true);

    const clean = normalize(origin);
    if (allowedOrigins.includes(clean) || vercelPreviewRegex.test(clean)) {
      return callback(null, true);
    }

    // Error throw NA karo: warna 500 jata hai bina CORS headers ke
    console.warn("CORS blocked origin:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Disposition"],
  optionsSuccessStatus: 204,
};

// CORS sab se pehle, taake har response (errors bhi) pe headers lagen
app.use(cors(corsOptions));
// Preflight (OPTIONS) yahin khatam, DB tak na jaye
app.options(/.*/, cors(corsOptions), (req, res) => res.sendStatus(204));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend is running" });
});

// Health check (MongoDB ki zaroorat nahi)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "API is working" });
});

// MongoDB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(503).json({ message: "Database connection failed" });
  }
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler (JSON response, CORS headers pehle hi lag chuke hain)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return;
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
