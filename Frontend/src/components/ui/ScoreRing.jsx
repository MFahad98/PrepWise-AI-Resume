// Circular progress ring for the job match score.
export const scoreTone = (score) => {
  if (score >= 75) return { label: "Strong match", ring: "text-emerald-500", badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" };
  if (score >= 50) return { label: "Moderate match", ring: "text-amber-500", badge: "bg-amber-50 text-amber-700 ring-amber-600/20" };
  return { label: "Needs work", ring: "text-rose-500", badge: "bg-rose-50 text-rose-700 ring-rose-600/20" };
};

const ScoreRing = ({ score = 0, size = 112, stroke = 10, className = "" }) => {
  const value = Math.min(100, Math.max(0, Number(score) || 0));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const tone = scoreTone(value);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Match score ${value} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-slate-100" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${tone.ring} transition-[stroke-dashoffset] duration-700 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold text-slate-900">{value}</span>
        <span className="text-[11px] font-medium text-slate-400">/ 100</span>
      </div>
    </div>
  );
};

export default ScoreRing;
