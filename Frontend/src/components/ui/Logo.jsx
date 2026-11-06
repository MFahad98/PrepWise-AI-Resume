import { useId } from "react";
import { Link } from "react-router-dom";

// PrepWise AI brand mark: interview speech bubble + "P" + AI sparkle
export const LogoMark = ({ className = "h-9 w-9" }) => {
  const gradientId = `pw-grad-${useId().replace(/:/g, "")}`;
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gradientId})`} />
      <path
        d="M10.5 12a3.5 3.5 0 013.5-3.5h12A3.5 3.5 0 0129.5 12v9a3.5 3.5 0 01-3.5 3.5h-6.6l-5.4 4.6v-4.6a3.5 3.5 0 01-3.5-3.5v-9z"
        fill="#fff"
      />
      <path
        d="M16.9 21V12.6h3.7a2.7 2.7 0 010 5.4h-3.7"
        stroke="#5B4FF0"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M31 25.6l.85 2.3 2.3.85-2.3.85-.85 2.3-.85-2.3-2.3-.85 2.3-.85.85-2.3z" fill="#FDE68A" />
    </svg>
  );
};

const Logo = ({ to = "/", inverted = false, className = "" }) => (
  <Link
    to={to}
    className={`group inline-flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 ${className}`}
    aria-label="PrepWise AI home"
  >
    <LogoMark className="h-9 w-9 drop-shadow-sm transition-transform group-hover:scale-105" />
    <span
      className={`font-display text-lg font-bold tracking-tight ${inverted ? "text-white" : "text-slate-900"}`}
    >
      PrepWise<span className={inverted ? "text-indigo-400" : "text-indigo-600"}> AI</span>
    </span>
  </Link>
);

export default Logo;
