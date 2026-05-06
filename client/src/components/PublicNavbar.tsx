import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { DozeyLogo } from '@/components/DozeyLogo';

const links = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/progress', label: 'Progress' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

export function PublicNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-[#0A1428] h-20 flex items-center transition-shadow duration-200 ${scrolled ? 'shadow-lg shadow-black/40' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex items-center justify-between">

          <Link to="/" className="flex-shrink-0 flex items-center" aria-label="DOZEY Home">
            <DozeyLogo className="h-12" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors relative group ${
                  isActive(to) ? 'text-[#10B981]' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-[#10B981] transition-all duration-200 ${isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden lg:inline-flex items-center px-4 py-2 rounded-[4px] text-sm font-medium text-[#94A3B8] hover:text-white border border-white/20 hover:border-white/40 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="hidden lg:inline-flex items-center px-5 py-2 rounded-[4px] text-sm font-semibold bg-[#10B981] hover:bg-[#0ea472] text-white transition-colors"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-[#94A3B8] hover:text-white transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-[#0A1428] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/10 flex-shrink-0">
            <Link to="/" aria-label="DOZEY Home">
              <DozeyLogo className="h-12" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-[#94A3B8] hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center px-3 py-4 rounded-[4px] text-base font-medium border-b border-white/10 transition-colors ${
                  isActive(to) ? 'text-[#10B981]' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-6 flex flex-col gap-3">
              <Link
                to="/login"
                className="block w-full text-center border border-white/20 text-[#94A3B8] hover:text-white font-medium px-6 py-3.5 rounded-[4px] text-base transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full text-center bg-[#10B981] hover:bg-[#0ea472] text-white font-semibold px-6 py-3.5 rounded-[4px] text-base transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
