import { CheckCircleIcon } from "../../../components/ui/Icons";

// Shared two-column shell for the login / register pages
const AuthShell = ({ title, subtitle, children, footer }) => (
  <section className="container-page grid min-h-[calc(100vh-4rem)] grid-cols-1 items-center gap-12 py-12 lg:grid-cols-2 lg:py-16">
    <div className="hidden lg:block">
      <p className="eyebrow">PrepWise AI</p>
      <h2 className="mt-3 max-w-md text-4xl font-bold leading-tight tracking-tight">
        Prepare smarter for the role you actually want.
      </h2>
      <ul className="mt-8 space-y-4 text-slate-600">
        {[
          "Match score against the real job description",
          "Interview questions with model answers",
          "Skill gaps and a 7-day preparation plan",
          "A tailored, ATS-friendly resume PDF",
        ].map((item) => (
          <li key={item} className="flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5 shrink-0 text-indigo-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>

    <div className="mx-auto w-full max-w-md">
      <div className="card p-6 shadow-lift sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </div>
      {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
    </div>
  </section>
);

export default AuthShell;
