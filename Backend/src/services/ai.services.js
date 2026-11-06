const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const fs = require("fs");

const puppeteer = require("puppeteer-core");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Gemini model (Vercel env se badal sakte hain)
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
// Optional: agar primary model busy ho to aakhri try is model se hogi
const GEMINI_FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "";

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Gemini kabhi kabhi "model overloaded" (503) ya rate limit (429) deta hai.
 * Aise errors par thora ruk kar dobara try karo, Vercel ki 60s limit ke andar.
 */
async function generateWithRetry(params, { attempts = 3, budgetMs = 35000 } = {}) {
  const models = [GEMINI_MODEL, GEMINI_MODEL, GEMINI_FALLBACK_MODEL || GEMINI_MODEL];
  const startedAt = Date.now();
  let lastError;

  for (let i = 0; i < attempts; i++) {
    const model = models[Math.min(i, models.length - 1)];
    try {
      return await ai.models.generateContent({ ...params, model });
    } catch (error) {
      lastError = error;
      const status = Number(error?.status || error?.code);
      if (!RETRYABLE_STATUS.has(status)) throw error;

      const waitMs = 1500 * 2 ** i; // 1.5s, 3s, 6s
      console.warn(`Gemini ${model} returned ${status}, attempt ${i + 1}/${attempts}`);
      if (i === attempts - 1 || Date.now() - startedAt + waitMs > budgetMs) break;
      await sleep(waitMs);
    }
  }

  console.error("Gemini failed after retries:", lastError?.message);
  const busy = new Error(
    "AI service is busy right now. Please try again in a minute."
  );
  busy.status = 503;
  throw busy;
}

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

    const response = await generateWithRetry({
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
const isServerless = Boolean(
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
);

// Local machine par installed Chrome / Edge dhoondo
function getLocalBrowserExecutablePath() {
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
        process.env["PROGRAMFILES(X86)"] &&
            `${process.env["PROGRAMFILES(X86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ];

    if (configuredPath && fs.existsSync(configuredPath)) {
        return configuredPath;
    }

    return systemPaths.find(
        (browserPath) => browserPath && fs.existsSync(browserPath)
    );
}

async function launchBrowser() {
    if (isServerless) {
        // Vercel par lightweight serverless Chromium use hota hai
        const chromium = require("@sparticuz/chromium");
        chromium.setGraphicsMode = false;

        return puppeteer.launch({
            args: puppeteer.defaultArgs({
                args: chromium.args,
                headless: "shell",
            }),
            executablePath: await chromium.executablePath(),
            headless: "shell",
        });
    }

    const executablePath = getLocalBrowserExecutablePath();
    if (!executablePath) {
        throw new Error(
            "Chrome/Edge not found. Install Google Chrome or set PUPPETEER_EXECUTABLE_PATH in .env"
        );
    }

    return puppeteer.launch({ executablePath, headless: true });
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await launchBrowser();

    try {
        const page = await browser.newPage();
        // HTML self-contained hai, is liye sirf 'load' ka wait kaafi hai
        await page.setContent(htmlContent, {
            waitUntil: "load",
            timeout: 15000,
        });

        return await page.pdf({
            format: "A4",
            printBackground: true,
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
                        Use only inline CSS and standard system fonts (Arial, Helvetica, sans-serif). Do NOT use any external links, Google Fonts, CDN stylesheets, scripts or images.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await generateWithRetry({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(resumePdfSchema),
        }
    })


    if (!response.text) {
        throw new Error("Gemini returned an empty response.")
    }

    const jsonContent = resumePdfSchema.parse(JSON.parse(response.text))

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    // Puppeteer Uint8Array return karta hai, Express ke liye Buffer mein convert
    return Buffer.from(pdfBuffer)

}

module.exports = {generativeAIInterviewReport,generateResumePdf};