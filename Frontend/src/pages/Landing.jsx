import { Link } from "react-router-dom";
import { useAuth } from "../Features/auth/Hooks/useAuth";
import ScoreRing from "../components/ui/ScoreRing";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  CodeIcon,
  DownloadIcon,
  FileTextIcon,
  GaugeIcon,
  RouteIcon,
  ShieldIcon,
  SparkleIcon,
  TargetIcon,
  UploadIcon,
  UsersIcon,
} from "../components/ui/Icons";

const features = [
  {
    icon: GaugeIcon,
    title: "Job match score",
    description: "See how closely your profile fits the role, scored from 0 to 100 against the actual job requirements.",
  },
  {
    icon: CodeIcon,
    title: "Technical questions",
    description: "Role-specific technical questions with the interviewer's intention and a structured model answer.",
  },
  {
    icon: UsersIcon,
    title: "Behavioral questions",
    description: "Prepare for teamwork, ownership and conflict questions with answers built from your own experience.",
  },
  {
    icon: TargetIcon,
    title: "Skill gap analysis",
    description: "Missing skills ranked by priority so you know exactly what to study before the interview.",
  },
  {
    icon: RouteIcon,
    title: "7-day preparation plan",
    description: "A day-by-day roadmap with focused tasks that turns your skill gaps into strengths.",
  },
  {
    icon: DownloadIcon,
    title: "Tailored resume PDF",
    description: "Download an ATS-friendly resume rewritten for the job description in one click.",
  },
];

const steps = [
  {
    icon: UploadIcon,
    title: "Upload your resume",
    description: "Add your latest resume as a PDF. We read it securely to understand your experience.",
  },
  {
    icon: FileTextIcon,
    title: "Paste the job description",
    description: "Add the role title, the job post and a short note about yourself.",
  },
  {
    icon: SparkleIcon,
    title: "Get your report",
    description: "In under a minute you get questions, skill gaps, a roadmap and a tailored resume.",
  },
];

// Static product preview shown in the hero (illustrative, not real data)
const ProductPreview = () => (
  <div className="relative">
    <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-indigo-200/60 via-violet-200/40 to-sky-100/50 blur-2xl" aria-hidden="true" />
    <div className="card overflow-hidden shadow-lift">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        </div>
        <span className="text-xs font-medium text-slate-400">Interview report · Preview</span>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center rounded-xl bg-slate-50 p-4">
          <ScoreRing score={82} size={104} stroke={9} />
          <span className="mt-3 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Strong match
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">Target role</p>
          <p className="mt-1 font-display text-base font-bold text-slate-900">MERN Stack Developer</p>

          <p className="mt-4 text-xs font-medium text-slate-400">Skill gaps</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">Docker · high</span>
            <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">Redis · medium</span>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Testing · low</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-100 p-5">
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white">01</span>
            <p className="text-sm font-medium leading-6 text-slate-800">
              How would you secure a REST API that uses JWT authentication?
            </p>
          </div>
          <p className="mt-3 pl-10 text-xs leading-5 text-slate-500">
            Intention: checks your understanding of token storage, expiry and refresh flows.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">02</span>
          <p className="truncate text-sm text-slate-600">Explain indexing strategies in MongoDB for large collections.</p>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">7-day plan</span>
          <span className="text-slate-400">Day 3 of 7</span>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <span key={day} className={`h-1.5 rounded-full ${day <= 3 ? "bg-indigo-500" : "bg-slate-200"}`} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Landing = () => {
  const { user } = useAuth();
  const primaryCta = user ? "/dashboard" : "/register";

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]"
          aria-hidden="true"
        />
        <div className="container-page relative grid grid-cols-1 items-center gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="min-w-0 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <SparkleIcon className="h-3.5 w-3.5" />
              AI-powered interview preparation
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Walk into every interview{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                fully prepared.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              ResumeAI compares your resume with the job you want and builds a
              personal report: match score, likely interview questions with
              model answers, skill gaps and a 7-day plan to close them.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={user ? "/dashboard" : "/login"} state={user ? undefined : { from: { pathname: "/dashboard" } }} className="btn-primary px-6 py-3.5 text-base">
                Generate my report
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="btn-secondary px-6 py-3.5 text-base">
                See how it works
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              {["Free to use", "Results in under a minute", "Tailored resume PDF"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-500" strokeWidth={2.4} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 animate-fade-up [animation-delay:120ms] lg:pl-6">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="scroll-mt-20 py-20 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Everything in one report</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Know what they'll ask, and how to answer
            </h2>
            <p className="mt-4 text-slate-600">
              Every report is generated from your resume and the exact job
              description, so the preparation is specific to you.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article key={title} className="card group p-6 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-slate-200 bg-white py-20 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From resume to ready in three steps
            </h2>
          </div>

          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            <div className="absolute left-[16.66%] right-[16.66%] top-6 hidden h-px bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200 md:block" aria-hidden="true" />
            {steps.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="relative flex flex-col items-center text-center">
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lift">
                  <Icon className="h-5 w-5" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold ring-4 ring-white">
                    {index + 1}
                  </span>
                </span>
                <h3 className="mt-6 text-lg font-bold">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">{description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { icon: ClockIcon, label: "Report ready in about a minute" },
              { icon: ShieldIcon, label: "Your reports stay private to your account" },
              { icon: FileTextIcon, label: "Every report saved to revisit any time" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <Icon className="h-5 w-5 shrink-0 text-indigo-600" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-indigo-500/30 blur-3xl" aria-hidden="true" />
            <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your next interview starts with a plan.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-slate-300">
              Upload your resume, paste the job description, and get a complete
              preparation report in minutes.
            </p>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={user ? "/dashboard" : "/login"} state={user ? undefined : { from: { pathname: "/dashboard" } }} className="btn bg-white px-6 py-3.5 text-base text-slate-900 hover:bg-indigo-50 focus-visible:ring-white/30">
                Generate my report
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              {!user && (
                <Link to={primaryCta} className="btn border border-white/20 px-6 py-3.5 text-base text-white hover:bg-white/10 focus-visible:ring-white/20">
                  Create free account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
