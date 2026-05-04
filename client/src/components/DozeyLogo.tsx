interface DozeyLogoProps {
  className?: string;
  theme?: 'light' | 'dark';
}

/**
 * DOZEY brand logo — inline SVG, zero file dependencies.
 * theme="light"  → navy text  (cream/white backgrounds)
 * theme="dark"   → cream text (navy backgrounds)
 *
 * Icon: two open hands cradling a standing person with a heart.
 * Wordmark: "DOZEY" as a single unified text block — bold DOZ, regular EY.
 * Uses a single <text> with <tspan> children so all glyphs share one
 * baseline and there is no visible gap between DOZ and EY.
 */
export function DozeyLogo({ className = 'h-12', theme = 'light' }: DozeyLogoProps) {
  const green = '#10B981';
  const textColor = theme === 'dark' ? '#F8F7F4' : '#0A1428';

  return (
    <svg
      viewBox="0 0 280 72"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto ${className}`}
      aria-label="DOZEY"
      role="img"
      fill="none"
    >
      {/* ── Icon: hands + person + heart (left column 0–56px) ── */}

      {/* Person head */}
      <circle cx="28" cy="10" r="5" stroke={green} strokeWidth="2.4" />

      {/* Left arm / hand */}
      <path
        d="M10 58 C6 47 6 34 12 24 C14 20 18 18 20 22 C22 18 26 18 26 24"
        stroke={green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Right arm / hand */}
      <path
        d="M46 58 C50 47 50 34 44 24 C42 20 38 18 36 22 C34 18 30 18 30 24"
        stroke={green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Heart */}
      <path
        d="M28 43 C28 43 20 37 20 32 C20 29 22.5 27 25 27 C26.5 27 27.5 28 28 29.2 C28.5 28 29.5 27 31 27 C33.5 27 36 29 36 32 C36 37 28 43 28 43 Z"
        stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── Wordmark: one <text> element, tspan for weight variation ──
          Keeping DOZ and EY in a single text run ensures they sit on the
          same baseline with no gap — the browser handles glyph advances
          correctly when they are in the same text flow.
      */}
      <text
        x="64"
        y="51"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontSize="40"
        fill={textColor}
        letterSpacing="-1"
      >
        <tspan fontWeight="800">DOZ</tspan><tspan fontWeight="400">EY</tspan>
      </text>
    </svg>
  );
}
