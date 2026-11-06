// pdf-parse/worker PEHLE load karna zaroori hai: yeh @napi-rs/canvas (DOMMatrix polyfill)
// ko load karta hai taake Vercel serverless bundle mein woh shamil ho jaye.
const { CanvasFactory, getPath } = require("pdf-parse/worker");
const pdfparse = require("pdf-parse");

pdfparse.PDFParse.setWorker(getPath());
const {generativeAIInterviewReport,generateResumePdf} = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReportModel");


async function generateInterviewReportController(req, res) {
  const { selfDescription, jobDescription } = req.body ?? {};
  const title = req.body?.title?.trim();

  if (!title) {
    return res.status(400).json({
      message: "Job title is required",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "Resume PDF file is required",
    });
  }

  if (!jobDescription) {
    return res.status(400).json({
      message: "Job description is required",
    });
  }

  const parser = new pdfparse.PDFParse({ data: req.file.buffer, CanvasFactory });
  let resumeContent;
  try {
    resumeContent = await parser.getText();
  } catch (err) {
    console.error("PDF parse failed:", err.message);
    return res.status(400).json({ message: "Could not read the resume PDF" });
  } finally {
    await parser.destroy().catch(() => {});
  }

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

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id,
    })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    let pdfBuffer
    try {
        pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })
    } catch (err) {
        console.error("Resume PDF generation failed:", err)
        const status = err.status === 503 ? 503 : 500
        return res.status(status).json({
            message: status === 503
                ? err.message
                : "Could not generate the resume PDF. Please try again."
        })
    }

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}
module.exports = { generateInterviewReportController,getAllInterviewReportController,getInterviewReportByIdController,generateResumePdfController };
