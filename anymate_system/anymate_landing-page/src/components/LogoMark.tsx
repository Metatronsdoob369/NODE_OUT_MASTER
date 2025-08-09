interface LogoMarkProps {
  className?: string;
}

export default function LogoMark({ className = '' }: LogoMarkProps) {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id="fire-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="var(--fire-1)" />
            <stop offset="50%" stopColor="var(--fire-2)" />
            <stop offset="100%" stopColor="var(--fire-3)" />
          </linearGradient>
        </defs>
        
        {/* Outer flame shape */}
        <path
          d="M16 2c-3 4-4 8-3 12 0.5 2 2 3.5 4 4 2-0.5 3.5-2 4-4 1-4 0-8-3-12z"
          fill="url(#fire-gradient)"
          className="animate-flame"
        />
        
        {/* Inner flame core */}
        <path
          d="M16 6c-1.5 2-2 4-1.5 6 0.25 1 1 1.75 2 2 1-0.25 1.75-1 2-2 0.5-2 0-4-1.5-6z"
          fill="var(--fire-3)"
          opacity="0.8"
          className="animate-flicker"
        />
        
        {/* Base/ember glow */}
        <circle
          cx="16"
          cy="28"
          r="3"
          fill="var(--fire-2)"
          opacity="0.6"
          className="animate-pulse"
        />
      </svg>
      
      <div className="flex items-baseline">
        <span className="text-2xl md:text-3xl bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--fire-1),var(--fire-2),var(--fire-3))] animate-flame font-bold tracking-tight">
          ANYM
        </span>
        <sup className="align-super ml-0.5 inline-block">
          <span className="inline-block text-lg md:text-xl bg-clip-text text-transparent bg-[linear-gradient(180deg,var(--fire-3),var(--fire-2),var(--fire-1))] animate-flicker font-bold">
            8
          </span>
        </sup>
      </div>
    </div>
  );
}