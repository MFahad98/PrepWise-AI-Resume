// Local development entry point (Vercel par api/index.js use hota hai)
require("dotenv").config({ quiet: true });
const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

connectDB().catch((err) => {
  console.error("Initial MongoDB connection failed:", err.message);
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
