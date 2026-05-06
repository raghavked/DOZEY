import logoDark  from '@/assets/DOZEY_Logo_Dark.png';
import logoLight from '@/assets/DOZEY_Logo_Light.png';

interface DozeyLogoProps {
  /** Tailwind height class, e.g. "h-10" or "h-14". Defaults to "h-12". */
  className?: string;
  /**
   * 'dark'  = DOZEY_Logo_Dark.png  (teal icon + white wordmark — for dark/black backgrounds).
   * 'light' = DOZEY_Logo_Light.png (teal icon + dark wordmark  — for light backgrounds).
   * Defaults to 'dark'.
   */
  theme?: 'dark' | 'light';
}

/**
 * DOZEY brand logo component.
 *
 * Uses the official DOZEY_Logo_Dark.png / DOZEY_Logo_Light.png assets.
 * The icon shows two hands cradling a person figure with a heart on their
 * chest — the correct DOZEY brand mark per the PDR.
 *
 * @example
 *   <DozeyLogo className="h-10" theme="dark" />
 */
export function DozeyLogo({ className = 'h-12', theme = 'dark' }: DozeyLogoProps) {
  const src = theme === 'light' ? logoLight : logoDark;
  return (
    <img
      src={src}
      alt="DOZEY"
      className={`w-auto object-contain ${className}`}
      draggable={false}
    />
  );
}

export default DozeyLogo;
