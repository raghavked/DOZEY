interface DozeyLogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'wordmark';
  theme?: 'light' | 'dark';
}

export function DozeyLogo({ className = 'h-10', variant = 'full', theme = 'light' }: DozeyLogoProps) {
  const textColor = theme === 'dark' ? '#fbfbfd' : '#1d1d1f';
  const blue = '#4a7fb5';
  const green = '#8aab45';
  const darkGreen = '#4d9068';

  const Mark = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{ height: '100%', width: 'auto' }}>
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor="#3a6a9e" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="24" y1="36" x2="36" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={green} />
          <stop offset="100%" stopColor={darkGreen} />
        </linearGradient>
      </defs>
      <path
        d="M24 2L6 10v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V10L24 2z"
        fill="url(#shieldGrad)"
        opacity="0.95"
      />
      <path
        d="M24 2L6 10v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V10L24 2z"
        fill="none"
        stroke={blue}
        strokeWidth="1"
        opacity="0.2"
      />
      <rect x="21" y="14" width="6" height="18" rx="1.5" fill="white" opacity="0.95" />
      <rect x="15" y="20" width="18" height="6" rx="1.5" fill="white" opacity="0.95" />
      <circle cx="37" cy="11" r="7" fill="url(#accentGrad)" stroke="white" strokeWidth="1.5" />
      <path
        d="M37 6.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 1c.8 0 1.5.3 2.1.7-0.3.2-.7.3-1.1.4-.2-.3-.5-.5-.9-.5s-.7.2-.9.5c-.4-.1-.8-.3-1.1-.4.5-.4 1.2-.7 2-.7zm-2.7 1.5c.3.2.7.4 1.2.5 0 .2 0 .3.1.5H34c0-.4.1-.7.3-1zm5.4 0c.2.3.3.6.3 1h-1.5c0-.2 0-.3.1-.5.4-.1.8-.3 1.2-.5zM34 10h1.6c0 .2 0 .4.1.5-.4.2-.9.3-1.3.5-.3-.3-.4-.6-.4-1zm4.7 1c-.4-.2-.9-.3-1.3-.5 0-.2.1-.4.1-.5H40c0 .4-.1.7-.3 1zM37 12.5c-.5 0-.9-.3-1.1-.6.4-.1.8-.2 1.1-.2.4 0 .7.1 1.1.2-.2.3-.6.6-1.1.6z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );

  const Wordmark = () => (
    <svg viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '60%', width: 'auto' }}>
      <text
        x="0"
        y="28"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
        fontSize="32"
        fontWeight="700"
        letterSpacing="1.5"
        fill={textColor}
      >
        DOZEY
      </text>
    </svg>
  );

  if (variant === 'mark') {
    return (
      <div className={`flex items-center ${className}`}>
        <Mark />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={`flex items-center ${className}`}>
        <Wordmark />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Mark />
      <div className="flex flex-col justify-center leading-none">
        <span
          className="font-bold tracking-wide"
          style={{ color: textColor, fontSize: '1.6em', lineHeight: 1, letterSpacing: '0.05em' }}
        >
          DOZEY
        </span>
        <span
          className="tracking-[0.2em] uppercase font-medium"
          style={{ color: green, fontSize: '0.45em', lineHeight: 1.8 }}
        >
          Vaccine Records
        </span>
      </div>
    </div>
  );
}
