export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md"
    >
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      <path
        d="M 100 20 L 160 50 L 160 110 C 160 160 100 180 100 180 C 100 180 40 160 40 110 L 40 50 Z"
        fill="url(#shieldGradient)"
        stroke="#1e3a8a"
        strokeWidth="2"
      />

      <circle cx="100" cy="95" r="45" fill="rgba(255, 255, 255, 0.1)" />

      <g>
        <circle cx="80" cy="120" r="4" fill="url(#accentGradient)" />
        <circle cx="100" cy="100" r="4" fill="url(#accentGradient)" />
        <circle cx="120" cy="80" r="4" fill="url(#accentGradient)" />

        <line
          x1="80"
          y1="120"
          x2="100"
          y2="100"
          stroke="url(#accentGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="100"
          x2="120"
          y2="80"
          stroke="url(#accentGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      <circle cx="145" cy="55" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />

      <path
        d="M 95 105 L 102 112 L 115 95"
        stroke="rgba(255, 255, 255, 0.7)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoWithText({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Logo size={size} />
      <span className="font-semibold text-primary-blue dark:text-white">TransactionGuard</span>
    </div>
  );
}