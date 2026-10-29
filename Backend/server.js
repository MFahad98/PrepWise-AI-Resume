
require("dotenv").config();
const app = require("./src/app");
require("./src/config/database");

// const generativeAIInterviewReport = require("./src/services/ai.services");
// const { resume, selfDescription, jobDescription } = require("./src/services/temp");
 
// generativeAIInterviewReport({ resume, selfDescription, jobDescription })

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
