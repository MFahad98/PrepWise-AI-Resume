let userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistModel");
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

async function registerController(req, res) {
  let { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "please fill all the fields" });
  }
  let isUserAlreadyExist = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({ message: "user and email already exists" });
  }

  let hashedPassword = await bcrypt.hash(password, 10);
  let user = await userModel.create({
    username: username,
    email: email,
    password: hashedPassword,
  });
  const token = jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1d" },
  );
    res.cookie("token", token);
  res.status(201).json({
    message: "user created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });


 
}

async function loginController(req, res) { 
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: "please fill all the fields" });
  }

  let user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1d" },
  );
    res.cookie("token", token);
  res.status(201).json({
    message: "login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function logoutController(req, res) {
  let token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "user not logged in" });
  }
  if (token) {
    await blacklistTokenModel.create({ token });
  }
  res.clearCookie("token");
  res.status(200).json({ message: "logout successful" });
}

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id).select("-password");
  res.status(200).json({ 
    message: "user details fetched successfully",
    user:
    {
      id: user._id,
      username: user.username,
      email: user.email,

    } 

  });
}

module.exports = { registerController, loginController, logoutController,getMeController };
