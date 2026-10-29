const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const fs = require("fs");

const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchscore: z
    .number()
    .describe("The match score of the candidate for the job role"),

  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question to be asked in the interview"),

        intention: z
          .string()
          .describe("The intention of interview behind the question"),

        answer: z
          .string()
          .describe(
            "how to answer the question in interview,what points to be covered in answer,what approach to be used to answer the question in interview"
          ),
      })
    )
    .describe("Technical questions to be asked in the interview"),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question to be asked in the interview"),

        intention: z
          .string()
          .describe("The intention of interview behind the question"),

        answer: z
          .string()
          .describe(
            "how to answer the question in interview,what points to be covered in answer,what approach to be used to answer the question in interview"
          ),
      })
    )
    .describe("Behavioral questions to be asked in the interview"),

  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe("The skill which the candidate is lacking"),

        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of the skill gap i.e"),
      })
    )
    .describe("list of skill gaps identified in the candidate"),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number of the preparation plan"),

        focus: z
          .string()
          .describe("The focus area for the preparation plan on that day"),

        tasks: z
          .array(z.string())
          .describe("The tasks to be completed on that day for preparation"),
      })
    )
    .describe("The preparation plan for the candidate to improve their skills"),


    title: z
    .string()
    .describe("The title of the job for which interview report is generated"),

});

async function generativeAIInterviewReport({
  resume,
  selfDescription,
  jobDescription,
  title,
}) {
  try {
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      throw new Error("GOOGLE_GENAI_API_KEY is missing from .env");
    }

    const prompt = `
Generate a detailed interview report using the candidate's information.

Follow the provided schema exactly.

IMPORTANT RULES:
1. Return only the properties defined in the schema.
2. Do not add extra properties or change property names.
3. Include question, intention, and answer for every technical question.
4. Include question, intention, and answer for every behavioral question.
5. Identify skill gaps based on the resume and job description.
6. Generate exactly 7 days in the preparation plan.
7. The matchscore must be a number between 0 and 100.
8. Use only the candidate information provided.
9. Return valid JSON.
10. Every question must have a meaningful intention and a detailed answer.

CANDIDATE RESUME:
${resume}

CANDIDATE SELF-DESCRIPTION:
${selfDescription}

TARGET JOB TITLE:
${title}

JOB DESCRIPTION:
${jobDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: z.toJSONSchema(interviewReportSchema),
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const report = interviewReportSchema.parse(JSON.parse(response.text));
    console.log("RAW GEMINI RESPONSE:", report);

    return report;
  } catch (error) {
    console.error(
      "Interview report generation failed:",
      error.message
    );

    if (error.name === "ZodError") {
      console.error(
        "Schema validation errors:",
        JSON.stringify(error.issues, null, 2)
      );
    }

    throw error;
  }
}
function getBrowserExecutablePath() {
    const configuredPath =
        process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
    const systemPaths = [
        process.env.LOCALAPPDATA &&
            `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
        process.env.PROGRAMFILES &&
            `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
        process.env["PROGRAMFILES(X86)"] &&
            `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
        process.env.LOCALAPPDATA &&
            `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe`,
        process.env.PROGRAMFILES &&
            `${process.env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`,
        "/usr/bin/google-chrome",
        "/usr/bin/chromium",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ];

    if (configuredPath && fs.existsSync(configuredPath)) {
        return configuredPath;
    }

    const systemPath = systemPaths.find(
        (browserPath) => browserPath && fs.existsSync(browserPath)
    );
    if (systemPath) {
        return systemPath;
    }

    const bundledPath = puppeteer.executablePath();
    return fs.existsSync(bundledPath) ? bundledPath : undefined;
}

async function generatePdfFromHtml(htmlContent) {
    const executablePath = getBrowserExecutablePath();
    const browser = await puppeteer.launch(
        executablePath ? { executablePath } : undefined
    );

    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        return await page.pdf({
            format: "A4",
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm",
            },
        });
    } finally {
        await browser.close();
    }
}
async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = {generativeAIInterviewReport,generateResumePdf};