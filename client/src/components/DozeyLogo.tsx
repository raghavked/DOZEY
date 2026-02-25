import logoImage from '@assets/ChatGPT_Image_Jan_11,_2026,_08_43_52_PM_1771968261059.png';

interface DozeyLogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'wordmark';
  theme?: 'light' | 'dark';
}

export function DozeyLogo({ className = 'h-10', variant = 'full', theme = 'light' }: DozeyLogoProps) {
  const blendStyle = theme === 'dark' ? { mixBlendMode: 'multiply' as const } : {};

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoImage}
        alt="Dozey Vaccine Records"
        className="h-full w-auto object-contain"
        style={{ maxHeight: '100%', ...blendStyle }}
      />
    </div>
  );
}
