import { Link } from "react-router-dom";
import { SparkleIcon } from "./Icons";

const Logo = ({ to = "/", inverted = false, className = "" }) => (
  <Link
    to={to}
    className={`group inline-flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 ${className}`}
    aria-label="ResumeAI home"
  >
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/30 transition-transform group-hover:scale-105">
      <SparkleIcon className="h-5 w-5" />
    </span>
    <span
      className={`font-display text-lg font-bold tracking-tight ${
        inverted ? "text-white" : "text-slate-900"
      }`}
    >
      Resume<span className="text-indigo-500">AI</span>
    </span>
  </Link>
);

export default Logo;
