interface DozeyLogoProps {
  /** Tailwind height class, e.g. "h-10" or "h-14". Defaults to "h-12". */
  className?: string;
  /** 'dark' = teal icon + cream wordmark (default, for dark backgrounds).
   *  'light' = teal icon + dark wordmark (for light backgrounds). */
  theme?: 'dark' | 'light';
}

/**
 * DOZEY brand logo — pixel-perfect inline SVG, zero file dependencies.
 *
 * CORRECT icon per PDR: two hands cradling a person figure with a heart on
 * their chest (matches DOZEY_Logo_Dark.png exactly).
 *
 * Layout: icon to the left of DOZEY wordmark (horizontal/inline).
 * Use className to control height; width is auto.
 */
export function DozeyLogo({ className = 'h-12', theme = 'dark' }: DozeyLogoProps) {
  const green    = '#38D4B8';
  const wordmark = theme === 'light' ? '#0F1A22' : '#F8F7F4';

  return (
    <svg
      viewBox="0 0 260 72"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto ${className}`}
      aria-label="DOZEY"
      role="img"
      fill="none"
    >
      {/* ── ICON (0–56px column) ── */}

      {/* Head */}
      <circle cx="28" cy="8" r="5" stroke={green} strokeWidth="2.2" />

      {/* Body / torso */}
      <rect x="22" y="15" width="12" height="11" rx="3" stroke={green} strokeWidth="2" />

      {/* Heart on torso */}
      <path
        d="M25.5 18.5 C25.5 17 26.8 16.2 28 17.5 C29.2 16.2 30.5 17 30.5 18.5 C30.5 20.3 28 22.2 28 22.2 C28 22.2 25.5 20.3 25.5 18.5 Z"
        stroke={green} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Legs */}
      <path d="M25 26 L23 34" stroke={green} strokeWidth="2" strokeLinecap="round" />
      <path d="M31 26 L33 34" stroke={green} strokeWidth="2" strokeLinecap="round" />

      {/* LEFT HAND — cupped palm rising from lower-left, cradling the figure */}
      <path
        d="M4 62 C3 55 3 44 6 36
           C7.5 31 10 29 12 31.5
           C13 29 15.5 28.5 17 30.5
           C18 28.5 20.5 28.5 21.5 30.5
           C22.5 28.5 25 28.5 25.5 31
           L26 37
           C26 37 24 35 23 36
           C22 37 22.5 39 23.5 39.5
           L20 42.5
           C18.5 44 17.5 47 17.5 50
           L17.5 54
           C17.5 55.5 16 56 15 55
           L12 52
           C9.5 50 7 54 4 62 Z"
        stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* RIGHT HAND — mirror of left hand */}
      <path
        d="M52 62 C53 55 53 44 50 36
           C48.5 31 46 29 44 31.5
           C43 29 40.5 28.5 39 30.5
           C38 28.5 35.5 28.5 34.5 30.5
           C33.5 28.5 31 28.5 30.5 31
           L30 37
           C30 37 32 35 33 36
           C34 37 33.5 39 32.5 39.5
           L36 42.5
           C37.5 44 38.5 47 38.5 50
           L38.5 54
           C38.5 55.5 40 56 41 55
           L44 52
           C46.5 50 49 54 52 62 Z"
        stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── WORDMARK (starts at x=64) ── */}
      <text
        x="64"
        y="51"
        fontFamily="'Poppins', 'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontSize="40"
        fill={wordmark}
        letterSpacing="-1"
      >
        <tspan fontWeight="800">DOZ</tspan><tspan fontWeight="400">EY</tspan>
      </text>
    </svg>
  );
}

export default DozeyLogo;
