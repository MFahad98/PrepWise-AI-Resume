const {Router}=require('express')
const authController=require("../controllers/authController")
const authRouter= Router()
const authMiddleware=require("../middlewares/authMiddleware")
// api/auth/register
authRouter.post("/register",authController.registerController)
authRouter.post("/login",authController.loginController)
authRouter.get("/logout",authController.logoutController)
authRouter.post("/logout",authController.logoutController)
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)


module.exports=authRouter