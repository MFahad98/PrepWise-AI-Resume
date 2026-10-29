const pdfparse = require("pdf-parse");
const {generativeAIInterviewReport,generateResumePdf} = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReportModel");


async function generateInterviewReportController(req, res) {
  const { selfDescription, jobDescription } = req.body;
  const title = req.body?.title?.trim();

  if (!title) {
    return res.status(400).json({
      message: "Job title is required",
    });
  }

  const parser = new pdfparse.PDFParse({ data: req.file.buffer });
  const resumeContent = await parser.getText();

  const generativeReportAi = await generativeAIInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    title,
  });
  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    title,
    matchScore: generativeReportAi.matchscore,
    technicalQuestions: generativeReportAi.technicalQuestions,
    behaviourQuestions: generativeReportAi.behavioralQuestions,
    skillGaps: generativeReportAi.skillGaps,
    preparationPlan: generativeReportAi.preparationPlan,
  });
  res.status(201).json({
    message: "Interview report generated sucessfully",
    interviewReport,
  });
}

async function getInterviewReportByIdController(req,res){
   const {interviewId}=req.params;
   const interviewReport= await interviewReportModel.findOne({_id:interviewId,user:req.user.id})

   if(!interviewReport){
    return res.status(404).json({
      message:"Interview report not found"
    })
   }

   res.status(200).json({
    message:"Interview report fetched Successfully",
    interviewReport
   })
}

async function getAllInterviewReportController(req,res){ 
   const interviewReports= await (interviewReportModel.find({user:req.user.id})).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -updatedAt -__v -technicalQuestions -behaviourQuestions -skillGaps -preparationPlan")

   if(!interviewReports){
    return res.status(404).json({
      message:"Interview report not found"
    })
   }

   res.status(200).json({
    message:"Interview reports fetched Successfully",
    interviewReports
   })
}
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}
module.exports = { generateInterviewReportController,getAllInterviewReportController,getInterviewReportByIdController,generateResumePdfController };
