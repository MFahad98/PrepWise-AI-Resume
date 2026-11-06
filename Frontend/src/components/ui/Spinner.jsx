const Spinner = ({ className = "h-4 w-4" }) => (
  <svg
    className={`animate-spin ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const PageLoader = ({ label = "Loading..." }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
    <Spinner className="h-7 w-7 text-indigo-600" />
    <p className="text-sm">{label}</p>
  </div>
);

export default Spinner;
