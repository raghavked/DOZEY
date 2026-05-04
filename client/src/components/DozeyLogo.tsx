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
 * Wordmark: bold DOZ + regular EY, matching the chosen logo.
 */
export function DozeyLogo({ className = 'h-12', theme = 'light' }: DozeyLogoProps) {
  const green = '#10B981';
  const text  = theme === 'dark' ? '#F8F7F4' : '#0A1428';

  return (
    <svg
      viewBox="0 0 260 72"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto ${className}`}
      aria-label="DOZEY"
      role="img"
      fill="none"
    >
      {/* ── Icon (left, 56×56 centred in 0-64 column) ── */}

      {/* Person — head */}
      <circle cx="28" cy="10" r="5" stroke={green} strokeWidth="2.4" />

      {/* Left hand / arm */}
      <path
        d="M10 56 C6 46 6 34 12 24 C14 20 18 18 20 22 C22 18 26 18 26 24"
        stroke={green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Right hand / arm */}
      <path
        d="M46 56 C50 46 50 34 44 24 C42 20 38 18 36 22 C34 18 30 18 30 24"
        stroke={green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Heart inside the hands */}
      <path
        d="M28 42 C28 42 20 36 20 31 C20 28 22.5 26 25 26 C26.5 26 27.5 27 28 28.2 C28.5 27 29.5 26 31 26 C33.5 26 36 28 36 31 C36 36 28 42 28 42 Z"
        stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── Wordmark ── */}
      {/* Bold "DOZ" */}
      <text
        x="60" y="50"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="38"
        fill={text}
        letterSpacing="-1"
      >DOZ</text>

      {/* Regular "EY" */}
      <text
        x="155" y="50"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="400"
        fontSize="38"
        fill={text}
        letterSpacing="-1"
      >EY</text>
    </svg>
  );
}
