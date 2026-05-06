interface DozeyLogoProps {
  className?: string;
}

/**
 * DOZEY brand logo — inline SVG, zero file dependencies.
 * Always renders in dark scheme: navy background, green icon, cream wordmark.
 * Matches the approved DOZEY_Logo_Dark.png reference.
 */
export function DozeyLogo({ className = 'h-12' }: DozeyLogoProps) {
  const green = '#10B981';
  const cream = '#F8F7F4';

  return (
    <svg
      viewBox="0 0 280 72"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto ${className}`}
      aria-label="DOZEY"
      role="img"
      fill="none"
    >
      {/* ── ICON: centred in 0–56px column ── */}

      {/* Head */}
      <circle cx="28" cy="7" r="4.5" stroke={green} strokeWidth="2.2" />

      {/* Neck */}
      <line x1="28" y1="11.5" x2="28" y2="15" stroke={green} strokeWidth="2" strokeLinecap="round" />

      {/* Torso */}
      <rect x="22" y="15" width="12" height="11" rx="3" stroke={green} strokeWidth="2" />

      {/* Heart on torso */}
      <path
        d="M25.5 18.5 C25.5 17 26.6 16.2 28 17.3 C29.4 16.2 30.5 17 30.5 18.5 C30.5 20.2 28 22 28 22 C28 22 25.5 20.2 25.5 18.5 Z"
        stroke={green} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Legs */}
      <path d="M25 26 L23 34" stroke={green} strokeWidth="2" strokeLinecap="round" />
      <path d="M31 26 L33 34" stroke={green} strokeWidth="2" strokeLinecap="round" />

      {/* LEFT HAND — smooth cupped palm */}
      <path
        d="M4 56 C3 50 3 42 6 34 C7.5 29 10 27.5 12 30 C13 27.5 15.5 27 17 29 C18 27 20.5 27 21.5 29.5 C22.5 27.5 25 27.5 25.5 30 L26 35 C26 35 24 33.5 23 34.5 C22 35.5 22.5 37 23.5 37.5 L20 40 C18.5 41.5 17.5 44 17.5 47 L17.5 51 C17.5 52.5 16 53 15 52 L12 49 C9.5 47 7 51 4 56 Z"
        stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* RIGHT HAND — mirror */}
      <path
        d="M52 56 C53 50 53 42 50 34 C48.5 29 46 27.5 44 30 C43 27.5 40.5 27 39 29 C38 27 35.5 27 34.5 29.5 C33.5 27.5 31 27.5 30.5 30 L30 35 C30 35 32 33.5 33 34.5 C34 35.5 33.5 37 32.5 37.5 L36 40 C37.5 41.5 38.5 44 38.5 47 L38.5 51 C38.5 52.5 40 53 41 52 L44 49 C46.5 47 49 51 52 56 Z"
        stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── WORDMARK — single text run ── */}
      <text
        x="64"
        y="51"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontSize="40"
        fill={cream}
        letterSpacing="-1"
      >
        <tspan fontWeight="800">DOZ</tspan><tspan fontWeight="400">EY</tspan>
      </text>
    </svg>
  );
}
