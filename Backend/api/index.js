// Vercel serverless entry point
require("dotenv").config({ quiet: true });
const app = require("../src/app");

module.exports = app;
