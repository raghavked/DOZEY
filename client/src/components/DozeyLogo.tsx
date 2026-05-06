interface DozeyLogoProps {
  className?: string;
  theme?: 'light' | 'dark';
}

/**
 * DOZEY brand logo — inline SVG, zero file dependencies.
 * theme="light"  → navy text  (cream/white backgrounds)
 * theme="dark"   → cream text (navy backgrounds)
 *
 * Icon: two smooth cupped hands cradling a standing person with a heart.
 * Clean professional line-art with bezier curves — no jagged edges.
 * Wordmark: "DOZEY" as a single unified text block — bold DOZ, regular EY.
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
      {/* ── ICON: centred in 0–56px column ── */}

      {/* Person head */}
      <circle cx="28" cy="7" r="4.5" stroke={green} strokeWidth="2.2" />

      {/* Person body — slim torso */}
      <path
        d="M25 13 C25 12 26.2 11.5 28 11.5 C29.8 11.5 31 12 31 13 L31 23 C31 24 29.8 24.5 28 24.5 C26.2 24.5 25 24 25 23 Z"
        stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Heart on torso */}
      <path
        d="M25.5 16.5 C25.5 15.1 26.5 14.4 28 15.4 C29.5 14.4 30.5 15.1 30.5 16.5 C30.5 18 28 20 28 20 C28 20 25.5 18 25.5 16.5 Z"
        stroke={green} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* LEFT HAND — smooth cupped palm, opening upward-right
          Starts at wrist bottom-left, curves up to fingertips, back down to palm */}
      <path
        d="
          M8 52
          C5 46 5 38 8 30
          C9.5 26 12 25 13.5 27
          C14 25 16 24 17.5 25.5
          C18 23.5 20 23 21.5 24.5
          C22 22.5 24 22.5 25 24
          L25.5 29
          C25.5 29 27 27.5 28 28.5
          C28.8 29.5 28 31 27 31.5
          L23.5 34
          C22 35.5 21 38 21 41
          L21 45
          C21 46.5 19.5 47 18.5 46
          L16 43
          C13.5 41 11 47 8 52 Z
        "
        stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* RIGHT HAND — mirror of left hand */}
      <path
        d="
          M48 52
          C51 46 51 38 48 30
          C46.5 26 44 25 42.5 27
          C42 25 40 24 38.5 25.5
          C38 23.5 36 23 34.5 24.5
          C34 22.5 32 22.5 31 24
          L30.5 29
          C30.5 29 29 27.5 28 28.5
          C27.2 29.5 28 31 29 31.5
          L32.5 34
          C34 35.5 35 38 35 41
          L35 45
          C35 46.5 36.5 47 37.5 46
          L40 43
          C42.5 41 44.5 47 48 52 Z
        "
        stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── WORDMARK ── single <text> with tspan for weight variation ── */}
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
