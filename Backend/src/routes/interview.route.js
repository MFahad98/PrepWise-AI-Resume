const express = require("express")
 
const interviewRouter = express.Router();
const authMiddleware= require("../middlewares/authMiddleware")
const interviewController=require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")
interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)
interviewRouter.get("/report/all",authMiddleware.authUser,interviewController.getAllInterviewReportController)
interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController.getInterviewReportByIdController)
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter