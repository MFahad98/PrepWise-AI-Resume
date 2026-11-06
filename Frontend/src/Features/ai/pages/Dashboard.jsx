import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInterview } from "../Hooks/useInterview";
import { useAuth } from "../../auth/Hooks/useAuth";
import Spinner from "../../../components/ui/Spinner";
import { scoreTone } from "../../../components/ui/ScoreRing";
import { REPORTS_SECTION_ID, scrollToSection } from "../../../components/layout/scroll";
import {
  AlertIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  CloseIcon,
  FileTextIcon,
  LayersIcon,
  SearchIcon,
  SparkleIcon,
  UploadIcon,
} from "../../../components/ui/Icons";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // backend limit: 3MB

const GENERATION_STEPS = [
  "Reading your resume...",
  "Comparing it with the job description...",
  "Writing technical and behavioral questions...",
  "Finding skill gaps...",
  "Building your 7-day plan...",
];

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

const formatSize = (bytes) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const FieldError = ({ id, children }) =>
  children ? (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
      <AlertIcon className="h-3.5 w-3.5" />
      {children}
    </p>
  ) : null;

/* ------------------------------ Report card ------------------------------ */
const ReportCard = ({ report }) => {
  const score = Math.round(Number(report.matchScore) || 0);
  const tone = scoreTone(score);

  return (
    <Link
      to={`/interview/${report._id}`}
      className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lift focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          <FileTextIcon className="h-5 w-5" />
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone.badge}`}>
          {score}% match
        </span>
      </div>

      <h3 className="mt-4 line-clamp-2 text-base font-bold leading-6 group-hover:text-indigo-700">
        {report.title || "Interview report"}
      </h3>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <CalendarIcon className="h-3.5 w-3.5" />
        {formatDate(report.createdAt)}
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        <div className={`h-full rounded-full bg-current ${tone.ring}`} style={{ width: `${score}%` }} />
      </div>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
        View report
        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
};

const ReportSkeleton = () => (
  <div className="card animate-pulse p-5" aria-hidden="true">
    <div className="flex justify-between">
      <div className="h-10 w-10 rounded-xl bg-slate-100" />
      <div className="h-6 w-20 rounded-full bg-slate-100" />
    </div>
    <div className="mt-4 h-4 w-3/4 rounded bg-slate-100" />
    <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
    <div className="mt-5 h-1.5 rounded-full bg-slate-100" />
    <div className="mt-5 h-4 w-24 rounded bg-slate-100" />
  </div>
);

/* ------------------------------- Dashboard ------------------------------- */
const Dashboard = () => {
  const { generateReport, reports, getReports } = useInterview();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ title: "", jobDescription: "", selfDescription: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getReports();
  }, [getReports]);

  // Generation ke dauran progress messages rotate karo
  useEffect(() => {
    if (!submitting) return undefined;
    setStepIndex(0);
    const timer = window.setInterval(
      () => setStepIndex((i) => Math.min(i + 1, GENERATION_STEPS.length - 1)),
      6000
    );
    return () => window.clearInterval(timer);
  }, [submitting]);

  const filteredReports = useMemo(() => {
    if (!Array.isArray(reports)) return [];
    const q = query.trim().toLowerCase();
    return q ? reports.filter((r) => (r.title || "").toLowerCase().includes(q)) : reports;
  }, [reports, query]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const selectFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrors((prev) => ({ ...prev, resume: "Please upload a PDF file." }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, resume: "File is too large. Maximum size is 3 MB." }));
      return;
    }
    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const clearFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Job title is required.";
    if (!resumeFile) next.resume = "Please upload your resume (PDF).";
    if (form.jobDescription.trim().length < 30) next.jobDescription = "Please paste the full job description (at least 30 characters).";
    if (form.selfDescription.trim().length < 20) next.selfDescription = "Tell us a little more about yourself (at least 20 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    const { report, error } = await generateReport({
      title: form.title.trim(),
      jobDescription: form.jobDescription.trim(),
      selfDescription: form.selfDescription.trim(),
      resumeFile,
    });
    setSubmitting(false);

    if (report?._id) {
      navigate(`/interview/${report._id}`);
    } else {
      setSubmitError(error || "Something went wrong. Please try again.");
    }
  };

  const reportCount = Array.isArray(reports) ? reports.length : 0;

  return (
    <div className="pb-20">
      {/* Page header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Welcome back{user?.username ? `, ${user.username}` : ""}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Create an interview report</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Add your resume and the job you're targeting. We'll generate questions,
              skill gaps and a preparation plan tailored to the role.
            </p>
          </div>
          <a
            href={`#${REPORTS_SECTION_ID}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/dashboard#${REPORTS_SECTION_ID}`, { replace: true });
              scrollToSection(REPORTS_SECTION_ID);
            }}
            className="btn-secondary shrink-0"
          >
            <LayersIcon className="h-4 w-4" />
            All reports
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-600">{reportCount}</span>
          </a>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="container-page mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} noValidate className="card lg:col-span-2">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-bold">Report details</h2>
            <p className="mt-1 text-sm text-slate-500">All fields are required.</p>
          </div>

          <fieldset disabled={submitting} className="space-y-7 px-6 py-7 sm:px-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="label">Job title</label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={updateField("title")}
                placeholder="e.g. MERN Stack Developer"
                className={`input ${errors.title ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100" : ""}`}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                maxLength={120}
              />
              <FieldError id="title-error">{errors.title}</FieldError>
            </div>

            {/* Resume */}
            <div>
              <span className="label" id="resume-label">Resume</span>
              {resumeFile ? (
                <div className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 ring-1 ring-inset ring-emerald-200">
                    <FileTextIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{resumeFile.name}</p>
                    <p className="text-xs text-slate-500">{formatSize(resumeFile.size)} · PDF</p>
                  </div>
                  <button type="button" onClick={clearFile} className="btn-ghost p-2" aria-label="Remove file">
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="resume"
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={onDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-9 text-center transition ${
                    dragActive
                      ? "border-indigo-400 bg-indigo-50"
                      : errors.resume
                      ? "border-rose-300 bg-rose-50/40"
                      : "border-slate-200 bg-slate-50/60 hover:border-indigo-300 hover:bg-indigo-50/40"
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-card ring-1 ring-inset ring-slate-200">
                    <UploadIcon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    <span className="text-indigo-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-slate-500">PDF only, up to 3 MB</p>
                </label>
              )}
              <input
                ref={fileInputRef}
                id="resume"
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                aria-labelledby="resume-label"
                onChange={(e) => selectFile(e.target.files?.[0])}
              />
              <FieldError id="resume-error">{errors.resume}</FieldError>
            </div>

            {/* Job description */}
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="jobDescription" className="label">Job description</label>
                <span className="text-xs text-slate-400">{form.jobDescription.length.toLocaleString()} characters</span>
              </div>
              <textarea
                id="jobDescription"
                rows={7}
                value={form.jobDescription}
                onChange={updateField("jobDescription")}
                placeholder="Paste the full job post: responsibilities, required skills and qualifications."
                className={`input resize-y leading-6 ${errors.jobDescription ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100" : ""}`}
                aria-invalid={Boolean(errors.jobDescription)}
                aria-describedby={errors.jobDescription ? "jd-error" : undefined}
              />
              <FieldError id="jd-error">{errors.jobDescription}</FieldError>
            </div>

            {/* Self description */}
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="selfDescription" className="label">About you</label>
                <span className="text-xs text-slate-400">{form.selfDescription.length.toLocaleString()} characters</span>
              </div>
              <textarea
                id="selfDescription"
                rows={5}
                value={form.selfDescription}
                onChange={updateField("selfDescription")}
                placeholder="A short summary of your experience, key projects and what you're looking for."
                className={`input resize-y leading-6 ${errors.selfDescription ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100" : ""}`}
                aria-invalid={Boolean(errors.selfDescription)}
                aria-describedby={errors.selfDescription ? "self-error" : undefined}
              />
              <FieldError id="self-error">{errors.selfDescription}</FieldError>
            </div>
          </fieldset>

          <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="min-h-[1.25rem] text-sm" aria-live="polite">
              {submitting ? (
                <span className="flex items-center gap-2 text-indigo-700">
                  <Spinner className="h-4 w-4" />
                  {GENERATION_STEPS[stepIndex]}
                </span>
              ) : submitError ? (
                <span className="flex items-start gap-2 text-rose-600" role="alert">
                  <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  {submitError}
                </span>
              ) : (
                <span className="text-slate-500">Generation usually takes 20–60 seconds.</span>
              )}
            </div>
            <button type="submit" disabled={submitting} className="btn-primary shrink-0 px-6 py-3">
              {submitting ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Generating...
                </>
              ) : (
                <>
                  <SparkleIcon className="h-4 w-4" />
                  Generate report
                </>
              )}
            </button>
          </div>
        </form>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="text-base font-bold">What you'll get</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {[
                "Job match score out of 100",
                "Technical questions with model answers",
                "Behavioral questions with model answers",
                "Skill gaps ranked by priority",
                "A day-by-day 7-day preparation plan",
                "A tailored, ATS-friendly resume PDF",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-6">
            <h2 className="text-base font-bold text-indigo-950">Tips for a better report</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-indigo-900/80">
              <li>Paste the complete job post, not just the title.</li>
              <li>Use a text-based PDF (not a scanned image).</li>
              <li>Mention projects and measurable results in “About you”.</li>
            </ul>
          </div>
        </aside>
      </section>

      {/* All reports */}
      <section id={REPORTS_SECTION_ID} className="container-page mt-16 scroll-mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">All reports</h2>
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100">
                {reportCount}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Every report you generate is saved here.</p>
          </div>

          {reportCount > 0 && (
            <div className="relative w-full sm:w-72">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by job title"
                className="input py-2.5 pl-10"
                aria-label="Search reports"
              />
            </div>
          )}
        </div>

        <div className="mt-6">
          {reports === null ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => <ReportSkeleton key={i} />)}
            </div>
          ) : reportCount === 0 ? (
            <div className="card flex flex-col items-center px-6 py-14 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <LayersIcon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold">No reports yet</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Fill in the form above to generate your first interview report.
              </p>
              <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="btn-secondary mt-6">
                Create your first report
              </button>
            </div>
          ) : filteredReports.length === 0 ? (
            <p className="card px-6 py-10 text-center text-sm text-slate-500">
              No reports match “{query}”.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <ReportCard key={report._id} report={report} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
