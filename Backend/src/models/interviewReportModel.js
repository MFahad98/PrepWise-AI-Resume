const mongoose = require('mongoose');

// job description:string
// resume text:string
// self description:string
// matchScore :{type:Number, default:0},
// technical questions:[{question:"",intesion:"", answer:""}]

// behaviour questions:[{question:"",intesion:"", answer:""}] 
// skill gap :[{skill:"", severity:[ {type:String, enum:["low","medium","high"]}]}]
// preparation plan:[{day:number,focus:string, tasks:[string]}]

const technicalQuestionSchema = new mongoose.Schema(
    {
        question: { type: String, required: [true, "Question is required"] },
        intention: { type: String, required: [true, "Intention is required"] },
        answer: { type: String, required: [true, "Answer is required"] },

    }, { _id: false });

const behaviourQuestionSchema = new mongoose.Schema(
    {
        question: { type: String, required: [true, "Question is required"] },
        intention: { type: String, required: [true, "Intention is required"] },
        answer: { type: String, required: [true, "Answer is required"] },

    }, { _id: false });

const skillGapSchema = new mongoose.Schema(
    {
        skill: { type: String, required: [true, "Skill is required"] },
        severity: { type: String, enum: ["low", "medium", "high"], required: [true, "Severity is required"] }
    }, { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
    {
        day: { type: Number, required: [true, "Day is required"] },
        focus: { type: String, required: [true, "Focus is required"] },
        tasks: { type: [String], required: [true, "Tasks are required"] }
    }, { _id: false }
);



const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: [true, "Job description is required"], },
    resume: { type: String, },
    selfDescription: { type: String, },
    matchScore: {
        type: Number, min: [0, "Match score cannot be less than 0"], max: [100, "Match score cannot be more than 100"], default: 0
    },
 
    technicalQuestions: [
        technicalQuestionSchema
    ],

    behaviourQuestions: [
        behaviourQuestionSchema
    ],

    skillGaps: [
        skillGapSchema
    ],

    preparationPlan: [
        preparationPlanSchema
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
     title:{
        type:String,
        required: [true, "Job Title is required"]
    },
}, { timestamps: true });

const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);
module.exports = interviewReportModel;