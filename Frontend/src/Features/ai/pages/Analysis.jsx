import React, { useEffect, useState } from "react";
import { useInterview } from "../Hooks/useInterview";
import { useParams } from "react-router-dom";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("technical");
  const [selectedTechnical, setSelectedTechnical] = useState(0);
  const [selectedBehavioural, setSelectedBehavioural] = useState(0);

  const { loading, report, getReportById, getResumePdf } = useInterview();
  const { interviewId } = useParams();

  useEffect(() => {
    const fetchReport = async () => {
      if (interviewId) {
        await getReportById(interviewId);
      }
    };

    fetchReport();
  }, [interviewId, getReportById]);

  // Safe default data while the API report is loading.
  const data = report || {
    matchScore: 0,
    technicalQuestions: [],
    behaviourQuestions: [],
    preparationPlan: [],
    skillGaps: [],
  };

  // Ensure all collections are arrays.
  const technicalQuestions = Array.isArray(data.technicalQuestions)
    ? data.technicalQuestions
    : [];

  const behaviourQuestions = Array.isArray(data.behaviourQuestions)
    ? data.behaviourQuestions
    : [];

  const preparationPlan = Array.isArray(data.preparationPlan)
    ? data.preparationPlan
    : [];

  const skillGaps = Array.isArray(data.skillGaps) ? data.skillGaps : [];

  const matchScore = Math.min(100, Math.max(0, Number(data.matchScore) || 0));

  const navigation = [
    { id: "technical", label: "Technical Questions", icon: "⌘" },
    { id: "behavioural", label: "Behavioral Questions", icon: "◈" },
    { id: "roadmap", label: "Road Map", icon: "↗" },
  ];

  const scoreTone =
    matchScore >= 75
      ? { text: "text-emerald-400", bar: "from-emerald-400 to-teal-400", label: "Strong match" }
      : matchScore >= 50
      ? { text: "text-amber-300", bar: "from-amber-400 to-orange-400", label: "Moderate match" }
      : { text: "text-rose-300", bar: "from-rose-400 to-red-400", label: "Needs work" };

  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "border-red-400/25 bg-red-400/10 text-red-300";
      case "medium":
        return "border-amber-400/25 bg-amber-400/10 text-amber-300";
      case "low":
        return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
      default:
        return "border-white/10 bg-white/5 text-zinc-400";
    }
  };

  const getSeverityDot = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-400";
      case "medium":
        return "bg-amber-400";
      case "low":
        return "bg-emerald-400";
      default:
        return "bg-zinc-500";
    }
  };

  // FAQ accordion for interview questions.
  const renderQuestions = (items, type, selected, setSelected) => {
    if (items.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <p className="text-sm text-zinc-400">No questions available.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = selected === index;

          return (
            <div
              key={item._id || `${type}-${index}`}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? "border-indigo-400/40 bg-gradient-to-b from-indigo-500/[0.08] to-transparent shadow-lg shadow-indigo-950/40"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              {/* FAQ Question */}
              <button
                type="button"
                onClick={() => setSelected(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 p-4 text-left sm:gap-4 sm:p-5"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                    isOpen
                      ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-900/50"
                      : "bg-white/5 text-zinc-400"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 text-sm font-medium leading-6 text-zinc-100">
                  {item.question || "Untitled question"}
                </span>

                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg transition-transform duration-300 ${
                    isOpen
                      ? "rotate-180 border-indigo-400/30 bg-indigo-500/15 text-indigo-300"
                      : "border-white/10 text-zinc-400"
                  }`}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {/* FAQ Content */}
              <div
                id={`${type}-answer-${index}`}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-5 border-t border-white/10 px-4 py-5 sm:px-6">
                    {/* Interview Intention */}
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-indigo-300">
                          Interview Intention
                        </h4>
                      </div>

                      <p className="text-sm leading-7 text-zinc-400">
                        {item.intention || "No intention provided."}
                      </p>
                    </div>

                    {/* Suggested Answer */}
                    <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-400/15 text-xs text-emerald-300">
                          ✓
                        </span>
                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300">
                          Suggested Answer
                        </h4>
                      </div>

                      <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">
                        {item.answer || "No suggested answer available."}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-400">
                        {type} Question
                      </span>

                      <span className="text-xs text-zinc-500">
                        Question {index + 1} of {items.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Full-page loader while the report is being fetched.
  if (loading && !report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#09090b] text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500" />
        <p className="text-sm text-zinc-400">Loading interview report...</p>
      </div>
    );
  }

  const SectionHeading = ({ eyebrow, eyebrowClass, title, description, count }) => (
    <div className="mb-7">
      <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${eyebrowClass}`}>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
      <p className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
        {count}
      </p>
    </div>
  );

  return (
    <main className="relative min-h-screen bg-[#09090b] p-3 text-white sm:p-5 lg:p-7">
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1600px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0e] shadow-2xl shadow-black/60 lg:flex-row">
        {/* LEFT SIDEBAR */}
        <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[#0a0a0c] lg:w-72 lg:border-b-0 lg:border-r">
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl shadow-lg shadow-indigo-900/50">
                ✦
              </div>
              <div>
                <h2 className="font-bold tracking-tight">ResumeAI</h2>
                <p className="mt-0.5 text-xs text-zinc-500">Interview workspace</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Analysis
            </p>

            <nav aria-label="Interview analysis sections" className="flex flex-col gap-1.5">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-current={activeTab === item.id ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition-all ${
                    activeTab === item.id
                      ? "border-indigo-400/25 bg-gradient-to-r from-indigo-500/15 to-violet-500/5 font-medium text-indigo-200"
                      : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                      activeTab === item.id ? "bg-indigo-500/20 text-indigo-200" : "bg-white/5"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>

                  {activeTab === item.id && (
                    <span
                      aria-hidden="true"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Match Score */}
          <div className="mt-auto p-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl" />

              <div className="relative flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-400">Job Match Score</p>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${scoreTone.text}`}>
                  {scoreTone.label}
                </span>
              </div>

              <div className="relative mt-3 flex items-end gap-2">
                <span className={`text-4xl font-extrabold tracking-tight ${scoreTone.text}`}>
                  {matchScore}
                </span>
                <span className="mb-1.5 text-sm text-zinc-500">/ 100</span>
              </div>

              <div
                className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label="Job match score"
                aria-valuenow={matchScore}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${scoreTone.bar} transition-all duration-700`}
                  style={{ width: `${matchScore}%` }}
                />
              </div>

              <p className="relative mt-3 text-xs leading-5 text-zinc-500">
                Your profile's match with the target job.
              </p>
            </div>
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          <div className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-xs text-zinc-500">Resume Analysis / Workspace</p>
              <h1 className="mt-2 text-lg font-semibold tracking-tight">
                {navigation.find((item) => item.id === activeTab)?.label}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Analysis Ready
              </span>

              <button
                type="button"
                onClick={() => {
                  getResumePdf(interviewId);
                }}
                disabled={!report || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-900/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                aria-label="Download interview report as PDF"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3"
                  />
                </svg>
                Download Resume PDF
              </button>
            </div>
          </div>

          {/* TECHNICAL QUESTIONS */}
          {activeTab === "technical" && (
            <div>
              <SectionHeading
                eyebrow="Technical Assessment"
                eyebrowClass="text-indigo-400"
                title="Technical Questions"
                description="Explore interview questions, understand their purpose, and review suggested answers."
                count={`${technicalQuestions.length} questions generated`}
              />

              {renderQuestions(
                technicalQuestions,
                "Technical",
                selectedTechnical,
                setSelectedTechnical
              )}
            </div>
          )}

          {/* BEHAVIORAL QUESTIONS */}
          {activeTab === "behavioural" && (
            <div>
              <SectionHeading
                eyebrow="Personality & Experience"
                eyebrowClass="text-violet-400"
                title="Behavioral Questions"
                description="Prepare for questions about teamwork, leadership, communication, and problem-solving."
                count={`${behaviourQuestions.length} questions generated`}
              />

              {renderQuestions(
                behaviourQuestions,
                "Behavioral",
                selectedBehavioural,
                setSelectedBehavioural
              )}
            </div>
          )}

          {/* ROAD MAP */}
          {activeTab === "roadmap" && (
            <div>
              <SectionHeading
                eyebrow="Personalized Learning Plan"
                eyebrowClass="text-emerald-400"
                title="Your Road Map"
                description="Follow your preparation plan to strengthen your skills and prepare for interviews."
                count={`${preparationPlan.length} days in your learning plan`}
              />

              {preparationPlan.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
                  <p className="text-sm text-zinc-400">No preparation plan available.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {preparationPlan.map((day, index) => (
                    <div key={day._id || day.day || index} className="relative flex gap-4">
                      {index !== preparationPlan.length - 1 && (
                        <div className="absolute bottom-[-1.25rem] left-5 top-12 w-px bg-gradient-to-b from-emerald-400/30 to-white/5" />
                      )}

                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-xs font-bold text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                        {String(day.day ?? index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 transition-colors hover:border-white/20">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-400">
                          Day {day.day ?? index + 1}
                        </p>

                        <h3 className="mt-2 text-base font-semibold leading-6 text-zinc-50">
                          {day.focus || "Preparation"}
                        </h3>

                        <div className="mt-5">
                          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                            Tasks to Complete
                          </p>

                          {Array.isArray(day.tasks) && day.tasks.length > 0 ? (
                            <ul className="space-y-3">
                              {day.tasks.map((task, taskIndex) => (
                                <li
                                  key={taskIndex}
                                  className="flex items-start gap-3 text-sm leading-6 text-zinc-300"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-emerald-400/30 bg-emerald-400/10 text-[10px] text-emerald-300"
                                  >
                                    ✓
                                  </span>

                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-zinc-500">No tasks available.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full shrink-0 border-t border-white/10 bg-[#0a0a0c] p-5 sm:p-7 lg:w-72 lg:border-l lg:border-t-0 lg:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-tight">Skill Gaps</h2>

            <span className="rounded-md border border-amber-400/25 bg-amber-400/10 px-2 py-1 text-[10px] font-semibold text-amber-300">
              {String(skillGaps.length).padStart(2, "0")} FOUND
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Areas to improve for your target role.
          </p>

          <div className="mt-6 space-y-3">
            {skillGaps.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/10 p-4 text-xs text-zinc-500">
                No skill gaps available.
              </p>
            ) : (
              skillGaps.map((item, index) => (
                <div
                  key={item._id || `${item.skill}-${index}`}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${getSeverityDot(
                        item.severity
                      )}`}
                    />
                    <p className="text-sm font-medium leading-5 text-zinc-100">
                      {item.skill || "Unnamed skill"}
                    </p>
                  </div>

                  <span
                    className={`mt-3 inline-flex rounded-md border px-2 py-1 text-[10px] font-medium capitalize ${getSeverityStyle(
                      item.severity
                    )}`}
                  >
                    {item.severity || "Unknown"} priority
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Improvement Tip */}
          <div className="mt-8 rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/[0.03] p-4">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-lg text-indigo-300">
                ✦
              </span>
              <h3 className="text-xs font-semibold text-indigo-200">Improvement Tip</h3>
            </div>

            <p className="mt-3 text-xs leading-6 text-zinc-400">
              Prioritize missing skills and follow your learning roadmap to prepare for
              interviews.
            </p>
          </div>

          {/* Analysis Summary */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs font-medium text-zinc-300">Analysis Summary</p>

            <div className="mt-4 space-y-1">
              {[
                { label: "Technical Questions", value: technicalQuestions.length },
                { label: "Behavioral Questions", value: behaviourQuestions.length },
                { label: "Learning Days", value: preparationPlan.length },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-xs text-zinc-500">{row.label}</span>
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-semibold text-zinc-200">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Analytics;
