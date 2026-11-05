const { Router } = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const authRouter = Router();

// api/auth/...
authRouter.post("/register", authController.registerController);
authRouter.post("/login", authController.loginController);
// Frontend POST bhejta hai, isliye dono allow
authRouter.get("/logout", authController.logoutController);
authRouter.post("/logout", authController.logoutController);
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController);

module.exports = authRouter;
