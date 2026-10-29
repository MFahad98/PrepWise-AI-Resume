import React,{useState,useRef} from "react";
import {useInterview}  from "../Hooks/useInterview"
import { useNavigate } from "react-router-dom";
const Home = () => {
  const {loading ,generateReport,reports} =useInterview();
const[jobDescription,setJobDescription]=useState();
const[selfDescription,setSelfDescription]=useState();
const [title,setTitle]=useState();
const resumeInputRef = useRef();
console.log("title",title)
const navigate = useNavigate();

const handleGenerateReport = async () => {
  try {
    const resumeFile = resumeInputRef.current.files[0];

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
      title,
    });

    navigate(`/interview/${data._id}`);
  } catch (error) {
    console.error("Error generating interview report:", error);
  }
};
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl text-white shadow-xl shadow-indigo-200">
            ✦
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
            AI-Powered Career Assistant
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Your Next Career Move
            <span className="mt-2 block text-indigo-600">
              Starts Here.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Upload your resume, share your career goals, and prepare
            yourself for the opportunities you deserve.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">

          {/* Card Header */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-6 py-7 sm:px-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                📋
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create Your Career Profile
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Share a few details to get started.
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form className="space-y-9 p-6 sm:p-10">

            {/* Resume Upload */}
            <section>
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
                  01
                </span>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Upload Your Resume
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Upload your latest CV to get started.
                  </p>
                </div>
              </div>

              <label
                htmlFor="resume"
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-5 py-10 text-center transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50/50"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                  📄
                </div>

                <p className="text-base font-semibold text-slate-800">
                  Drop your resume here
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  or{" "}
                  <span className="font-semibold text-indigo-600">
                    browse files
                  </span>
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                    PDF
                  </span>
             
                </div>

                <input
                ref={resumeInputRef}
                  id="resume"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                />
              </label>
            </section>

            {/* Job Description */}
            <section>
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
                  02
                </span>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Target Job Description
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Tell us about the role you're applying for.
                  </p>
                </div>
              </div>

              <label
                htmlFor="jobDescription"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Job Description
                <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
              onChange={(e)=>{setJobDescription(e.target.value)}}
                id="jobDescription"
                rows="6"
                placeholder="Paste the job description here...

Example: We are looking for a MERN Stack Developer with experience in React.js, Node.js, Express.js, MongoDB, REST APIs, and authentication."
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Include the required skills, responsibilities, and qualifications.
              </p>
            </section>

            {/* Self Description */}
            <section>
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
                  03
                </span>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Tell Us About Yourself
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Highlight your experience, skills, and achievements.
                  </p>
                </div>
              </div>

              <label
                htmlFor="selfDescription"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Self Description
                <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
              onChange={(e)=>{setSelfDescription(e.target.value)}}
                id="selfDescription"
                rows="6"
                placeholder="Introduce yourself...

Example: I am a MERN Stack Developer passionate about building full-stack web applications. I have experience with React, Node.js, Express.js, MongoDB, and creating responsive user interfaces."
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Mention your technical skills, projects, and career goals.
              </p>
            </section>

               {/* Title */}
            <section>
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
                  04
                </span>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Tell Us About Your Job Title
                  </h3>
                  
                </div>
              </div>

              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Title
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
              onChange={(e)=>{setTitle(e.target.value)}}
                id="title"
                rows="6"
                type="text"
                placeholder="Your Stack"
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Mention your technical skills.
              </p>
            </section>

            {/* Tip Card */}
            <div className="flex gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                💡
              </div>

              <div>
                <h4 className="text-sm font-bold text-indigo-950">
                  Pro Tip
                </h4>
                <p className="mt-1 text-sm leading-6 text-indigo-900/70">
                  Be specific about your experience and achievements.
                  Detailed information helps create a more personalized
                  interview preparation experience.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-slate-100 pt-7">
              <button
                type="button" 
  onClick={handleGenerateReport}
  disabled={loading}

                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 sm:w-auto sm:min-w-64"
              >
                {loading ? "Generating Report..." : "Analyze My Resume"}

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
     <p className="mt-4 text-xs leading-5 text-slate-400">
                ✨ Get ready to take the next step in your career.
              </p>
            </div>

          </form>
        </div>


      {/* all reports */}

          {/* All Reports */}
      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              All Reports
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View your previously generated interview reports.
            </p>
          </div>

          <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            {reports?.length || 0} Reports
          </span>
        </div>

        {reports?.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <button
                key={report._id}
                type="button"
                onClick={() => navigate(`/interview/${report._id}`)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-2xl transition-colors group-hover:bg-indigo-600">
                  📄
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-slate-900 group-hover:text-indigo-600">
                    {report.title || "Interview Report"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Match Score: {report.matchScore ?? "N/A"}
                    {report.matchScore != null ? "%" : ""}
                  </p>
<p className="mt-1 text-xs text-slate-500">
  Created:{" "}
  {report.createdAt
    ? new Date(report.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A"}
</p>
                  <p className="mt-2 text-sm font-semibold text-indigo-600">
                    View Report
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mb-3 text-4xl">📋</div>

            <h3 className="font-bold text-slate-800">
              No Reports Yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Generate your first interview report to see it here.
            </p>
          </div>
        )}
      </section>
        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Powered by AI <span className="mx-2">·</span> Built for your next career move.
          </p>
        </footer>

      </div>
    </main>
  );
};

export default Home;