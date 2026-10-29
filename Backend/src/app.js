const express =require("express");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRouter=require("./routes/authentication")
const interviewRouter=require("./routes/interview.route")

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)
module.exports = app