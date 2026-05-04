interface DozeyLogoProps {
  className?: string;
  theme?: 'light' | 'dark';
}

/**
 * DOZEY brand logo — inline SVG, no external file dependency.
 * theme="light"  → navy icon + navy text  (for cream/white backgrounds)
 * theme="dark"   → green icon + cream text (for navy backgrounds)
 */
export function DozeyLogo({ className = 'h-10', theme = 'light' }: DozeyLogoProps) {
  const iconColor = '#10B981';           // emerald green — always
  const textColor = theme === 'dark' ? '#F8F7F4' : '#0A1428';

  return (
    <svg
      viewBox="0 0 220 80"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto ${className}`}
      aria-label="DOZEY — Healthcare Records"
      role="img"
    >
      {/* ── Icon: two hands cradling a person with a heart ── */}
      {/* Left hand */}
      <path
        d="M18 58 C10 50 8 38 14 28 C16 24 20 22 22 26 C24 22 28 22 28 28"
        fill="none" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Right hand */}
      <path
        d="M42 58 C50 50 52 38 46 28 C44 24 40 22 38 26 C36 22 32 22 32 28"
        fill="none" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Person head */}
      <circle cx="30" cy="18" r="4" fill="none" stroke={iconColor} strokeWidth="2.5" />
      {/* Heart */}
      <path
        d="M30 36 C30 36 23 31 23 27 C23 24.5 25 23 27 23 C28.5 23 29.5 24 30 25 C30.5 24 31.5 23 33 23 C35 23 37 24.5 37 27 C37 31 30 36 30 36 Z"
        fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── Wordmark: DOZEY ── */}
      {/* D */}
      <text x="60" y="52" fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800" fontSize="32" fill={textColor} letterSpacing="-0.5">
        DOZ
      </text>
      <text x="133" y="52" fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="400" fontSize="32" fill={textColor} letterSpacing="-0.5">
        EY
      </text>
    </svg>
  );
}
