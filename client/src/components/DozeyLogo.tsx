import logoLight from '@assets/dozey-logo-humanist-light.png';
import logoDark from '@assets/dozey-logo-humanist-dark.png';

interface DozeyLogoProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export function DozeyLogo({ className = 'h-10', theme = 'light' }: DozeyLogoProps) {
  const src = theme === 'dark' ? logoDark : logoLight;
  return (
    <img
      src={src}
      alt="DOZEY — Healthcare Records"
      className={`w-auto object-contain ${className}`}
      style={{ maxHeight: '100%' }}
    />
  );
}
