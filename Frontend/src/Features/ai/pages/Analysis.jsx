import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useInterview } from "../Hooks/useInterview";
import ScoreRing, { scoreTone } from "../../../components/ui/ScoreRing";
import Spinner from "../../../components/ui/Spinner";
import {
  AlertIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CodeIcon,
  DownloadIcon,
  RouteIcon,
  SparkleIcon,
  TargetIcon,
  UsersIcon,
} from "../../../components/ui/Icons";

const TABS = [
  { id: "technical", label: "Technical", icon: CodeIcon },
  { id: "behavioral", label: "Behavioral", icon: UsersIcon },
  { id: "roadmap", label: "Roadmap", icon: RouteIcon },
];

const SEVERITY_STYLES = {
  high: "bg-rose-50 text-rose-700 ring-rose-600/20",
  medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};
const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

const asArray = (value) => (Array.isArray(value) ? value : []);

/* ---------------------------- Question accordion ---------------------------- */
const QuestionList = ({ items, type }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (items.length === 0) {
    return <p className="card px-6 py-10 text-center text-sm text-slate-500">No questions available.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${type}-panel-${index}`;
        return (
          <div
            key={item._id || `${type}-${index}`}
            className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
              isOpen ? "border-indigo-200 shadow-card" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-start gap-4 p-5 text-left focus:outline-none focus-visible:bg-slate-50"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  isOpen ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 pt-1 text-sm font-semibold leading-6 text-slate-900">
                {item.question || "Untitled question"}
              </span>
              <ChevronDownIcon
                className={`mt-1.5 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-600" : ""}`}
              />
            </button>

            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div className="space-y-4 border-t border-slate-100 px-5 pb-6 pt-5 sm:pl-[4.25rem]">
                  <div>
                    <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      Why they ask this
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.intention || "No intention provided."}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200/70">
                    <h4 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      <CheckIcon className="h-4 w-4" strokeWidth={2.4} />
                      How to answer
                    </h4>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                      {item.answer || "No suggested answer available."}
                    </p>
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

/* -------------------------------- Roadmap -------------------------------- */
const Roadmap = ({ plan }) => {
  if (plan.length === 0) {
    return <p className="card px-6 py-10 text-center text-sm text-slate-500">No preparation plan available.</p>;
  }

  return (
    <ol className="relative space-y-4">
      {plan.map((day, index) => (
        <li key={day._id || day.day || index} className="relative flex gap-4">
          {index !== plan.length - 1 && (
            <span className="absolute bottom-[-1rem] left-5 top-12 w-px bg-slate-200" aria-hidden="true" />
          )}
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
            {String(day.day ?? index + 1).padStart(2, "0")}
          </span>
          <div className="card min-w-0 flex-1 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Day {day.day ?? index + 1}</p>
            <h3 className="mt-1 text-base font-bold leading-6">{day.focus || "Preparation"}</h3>
            {asArray(day.tasks).length > 0 ? (
              <ul className="mt-4 space-y-2.5">
                {day.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-300 bg-white" aria-hidden="true" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No tasks available.</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

/* -------------------------------- Skeleton -------------------------------- */
const AnalysisSkeleton = () => (
  <div className="container-page animate-pulse py-10" aria-label="Loading report">
    <div className="h-4 w-48 rounded bg-slate-200" />
    <div className="mt-4 h-8 w-80 max-w-full rounded bg-slate-200" />
    <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="h-40 rounded-2xl bg-slate-200" />
      <div className="grid min-w-0 grid-cols-2 gap-5 lg:col-span-2">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-[4.5rem] rounded-2xl bg-slate-200" />)}
      </div>
    </div>
    <div className="mt-8 h-96 rounded-2xl bg-slate-200" />
  </div>
);

/* -------------------------------- Analysis -------------------------------- */
const Analysis = () => {
  const { interviewId } = useParams();
  const { report, getReportById, getResumePdf } = useInterview();
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [activeTab, setActiveTab] = useState("technical");
  const [downloading, setDownloading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    let active = true;
    // Agar context mein yahi report pehle se poori hai (abhi generate hui) to dobara fetch mat karo
    if (report?._id === interviewId && Array.isArray(report.technicalQuestions)) {
      setStatus("ready");
      return undefined;
    }
    setStatus("loading");
    getReportById(interviewId).then((result) => {
      if (active) setStatus(result ? "ready" : "error");
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId, getReportById]);

  const handleDownload = async () => {
    setPdfError("");
    setDownloading(true);
    const error = await getResumePdf(interviewId);
    setDownloading(false);
    if (error) setPdfError(error);
  };

  if (status === "loading") return <AnalysisSkeleton />;

  if (status === "error" || !report) {
    return (
      <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Report not found</h1>
        <p className="mt-2 max-w-md text-slate-500">
          This report doesn't exist or you don't have access to it.
        </p>
        <Link to="/dashboard#reports" className="btn-primary mt-8">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to all reports
        </Link>
      </section>
    );
  }

  const technical = asArray(report.technicalQuestions);
  const behavioral = asArray(report.behaviourQuestions);
  const plan = asArray(report.preparationPlan);
  const skillGaps = [...asArray(report.skillGaps)].sort(
    (a, b) => (SEVERITY_ORDER[a.severity?.toLowerCase()] ?? 3) - (SEVERITY_ORDER[b.severity?.toLowerCase()] ?? 3)
  );
  const score = Math.min(100, Math.max(0, Math.round(Number(report.matchScore) || 0)));
  const tone = scoreTone(score);
  const createdAt = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  const stats = [
    { label: "Technical questions", value: technical.length, icon: CodeIcon },
    { label: "Behavioral questions", value: behavioral.length, icon: UsersIcon },
    { label: "Skill gaps found", value: skillGaps.length, icon: TargetIcon },
    { label: "Days in plan", value: plan.length, icon: RouteIcon },
  ];
  const counts = { technical: technical.length, behavioral: behavioral.length, roadmap: plan.length };

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/dashboard" className="hover:text-slate-900">Dashboard</Link>
            <span aria-hidden="true">/</span>
            <Link to="/dashboard#reports" className="hover:text-slate-900">Reports</Link>
            <span aria-hidden="true">/</span>
            <span className="truncate font-medium text-slate-900">{report.title || "Report"}</span>
          </nav>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{report.title || "Interview report"}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Analysis ready
                </span>
              </div>
              {createdAt && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <CalendarIcon className="h-4 w-4" />
                  Generated on {createdAt}
                </p>
              )}
            </div>

            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/dashboard#reports" className="btn-secondary">
                  <ArrowLeftIcon className="h-4 w-4" />
                  All reports
                </Link>
                <button type="button" onClick={handleDownload} disabled={downloading} className="btn-primary">
                  {downloading ? <Spinner className="h-4 w-4" /> : <DownloadIcon className="h-4 w-4" />}
                  {downloading ? "Preparing PDF..." : "Download tailored resume"}
                </button>
              </div>
              <div aria-live="polite" className="text-xs sm:text-right">
                {downloading && <p className="text-slate-500">This can take up to a minute.</p>}
                {pdfError && (
                  <p className="flex items-center gap-1.5 font-medium text-rose-600 sm:justify-end" role="alert">
                    <AlertIcon className="h-3.5 w-3.5" />
                    {pdfError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="container-page mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card flex min-w-0 items-center gap-6 p-6">
          <ScoreRing score={score} />
          <div>
            <p className="text-sm font-medium text-slate-500">Job match score</p>
            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone.badge}`}>
              {tone.label}
            </span>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-5 lg:col-span-2">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card flex items-center gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-2xl font-bold leading-none text-slate-900">{value}</p>
                <p className="mt-1.5 text-sm leading-5 text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="container-page mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div role="tablist" aria-label="Report sections" className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1">
            {TABS.map(({ id, label, icon: Icon }) => {
              const selected = activeTab === id;
              return (
                <button
                  key={id}
                  id={`tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`tabpanel-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2.5 sm:gap-2 sm:px-4 text-sm font-semibold transition ${
                    selected ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="hidden h-4 w-4 sm:block" />
                  {label}
                  <span className={`rounded-md px-1.5 py-0.5 text-xs ${selected ? "bg-white/15" : "bg-slate-100 text-slate-500"}`}>
                    {counts[id]}
                  </span>
                </button>
              );
            })}
          </div>

          <div id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="mt-6">
            {activeTab === "technical" && (
              <>
                <SectionIntro title="Technical questions" text="Questions an interviewer is likely to ask for this role, with the intention behind each and how to answer it." />
                <QuestionList key="technical" items={technical} type="technical" />
              </>
            )}
            {activeTab === "behavioral" && (
              <>
                <SectionIntro title="Behavioral questions" text="Prepare stories about teamwork, ownership, communication and problem-solving." />
                <QuestionList key="behavioral" items={behavioral} type="behavioral" />
              </>
            )}
            {activeTab === "roadmap" && (
              <>
                <SectionIntro title="Your 7-day roadmap" text="A focused daily plan to close your skill gaps before the interview." />
                <Roadmap plan={plan} />
              </>
            )}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Skill gaps</h2>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{skillGaps.length}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Areas to strengthen for this role.</p>

            {skillGaps.length === 0 ? (
              <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No skill gaps found.</p>
            ) : (
              <ul className="mt-5 divide-y divide-slate-100">
                {skillGaps.map((gap, index) => {
                  const severity = gap.severity?.toLowerCase();
                  return (
                    <li key={gap._id || `${gap.skill}-${index}`} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="text-sm font-medium leading-6 text-slate-800">{gap.skill || "Unnamed skill"}</span>
                      <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${SEVERITY_STYLES[severity] || "bg-slate-50 text-slate-600 ring-slate-500/20"}`}>
                        {severity || "unknown"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-slate-900 p-6 text-slate-300">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
              <SparkleIcon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-base font-bold text-white">Next step</h2>
            <p className="mt-2 text-sm leading-6">
              Start with the high-priority gaps, follow the roadmap daily, and
              practice answering each question out loud.
            </p>
            <button type="button" onClick={() => setActiveTab("roadmap")} className="mt-4 text-sm font-semibold text-indigo-300 hover:text-indigo-200">
              Open roadmap →
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
};

const SectionIntro = ({ title, text }) => (
  <div className="mb-5">
    <h2 className="text-xl font-bold">{title}</h2>
    <p className="mt-1 text-sm text-slate-500">{text}</p>
  </div>
);

export default Analysis;
