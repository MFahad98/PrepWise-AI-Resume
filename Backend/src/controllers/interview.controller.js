// pdf-parse ko sirf zaroorat pe load karo (lazy). Agar ye top pe load ho aur
// Vercel pe @napi-rs/canvas na mile to POORA server crash hota hai (FUNCTION_INVOCATION_FAILED).
let PDFParseClass = null;
let pdfCanvasFactory;
function getPDFParse() {
  if (!PDFParseClass) {
    // Pehle worker load karo: ye @napi-rs/canvas (DOMMatrix polyfill) laata hai
    const { CanvasFactory, getData } = require("pdf-parse/worker");
    const { PDFParse } = require("pdf-parse");
    PDFParse.setWorker(getData());
    PDFParseClass = PDFParse;
    pdfCanvasFactory = CanvasFactory;
  }
  return PDFParseClass;
}
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

  if (!req.file) {
    return res.status(400).json({
      message: "Resume PDF is required",
    });
  }

  const PDFParse = getPDFParse();
  const parser = new PDFParse({ data: req.file.buffer, CanvasFactory: pdfCanvasFactory });
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

    // puppeteer naye versions mein Uint8Array deta hai, Buffer banana zaroori hai
    res.send(Buffer.from(pdfBuffer))
}
module.exports = { generateInterviewReportController,getAllInterviewReportController,getInterviewReportByIdController,generateResumePdfController };
